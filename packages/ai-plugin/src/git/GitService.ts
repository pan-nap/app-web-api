import * as vscode from "vscode";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/** 最多分析的变更文件数 */
const MAX_FILES = 40;
/** 每个文件 diff 最多保留的行数 */
const MAX_LINES_PER_FILE = 80;
/** 发送给 AI 的变更上下文总字符上限（防止 token 超限） */
const MAX_TOTAL_CHARS = 30000;

type ChangeStatus = "M" | "A" | "D" | "R";

interface ChangeEntry {
  status: ChangeStatus;
  path: string;
  oldPath?: string;
}

export interface GitChangeSummary {
  ok: boolean;
  /** 出错 / 无变更时的提示信息 */
  message?: string;
  /** 用户可见的文件变更概览 */
  display: string;
  /** 完整 diff 上下文（发给 AI 使用） */
  context: string;
}

/**
 * Git 变更收集服务：读取当前工作区的未提交变更（git status + diff），
 * 整理成可供 AI 生成提交总结的上下文。
 */
export class GitService {
  private workspaceRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  private async runGit(args: string[], cwd: string): Promise<string> {
    const { stdout } = await execFileAsync("git", ["-c", "core.quotepath=false", ...args], {
      cwd,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024
    });
    return stdout;
  }

  private async readUntrackedContent(relPath: string): Promise<string> {
    const root = this.workspaceRoot();
    if (!root) return "";
    try {
      const uri = vscode.Uri.file(path.join(root, relPath));
      const bytes = await vscode.workspace.fs.readFile(uri);
      if (bytes.length > 200 * 1024) return "[文件过大，已跳过内容]";
      // 含 NUL 字节视为二进制文件
      if (bytes.includes(0)) return "[二进制文件，跳过内容]";
      return new TextDecoder().decode(bytes);
    } catch {
      return "";
    }
  }

  /** 截断 diff 到每文件上限行数与总上限字符数 */
  private truncate(diff: string, budget: { chars: number }): string {
    const lines = diff.split("\n");
    const kept = lines.slice(0, MAX_LINES_PER_FILE);
    const suffix = lines.length > MAX_LINES_PER_FILE ? `\n... (共 ${lines.length} 行，已截断)` : "";
    let out = kept.join("\n") + suffix;
    if (budget.chars - out.length < 0) {
      out = out.slice(0, budget.chars);
      out += "\n... (内容过长，已截断)";
    }
    budget.chars -= out.length;
    return out;
  }

  /**
   * 收集当前工作区 git 变更总结上下文。
   * - 非 git 仓库 / git 未安装 / 无变更时 ok=false 并给出提示。
   */
  async getChangeSummary(): Promise<GitChangeSummary> {
    const root = this.workspaceRoot();
    if (!root) {
      return { ok: false, message: "未打开工作区文件夹", display: "", context: "" };
    }

    // 1) 解析 git status（porcelain v1 + NUL 分隔，路径安全）
    let stdout: string;
    try {
      // -uall：展开未跟踪目录为具体文件，便于逐文件读取内容
      stdout = await this.runGit(["status", "--porcelain=v1", "-z", "-uall"], root);
    } catch (e: any) {
      return {
        ok: false,
        message: `无法读取 git 状态（${e?.message ?? e}）。请确认当前文件夹是 git 仓库。`,
        display: "",
        context: ""
      };
    }

    const segments = stdout.split("\0").filter((s) => s.length > 0);
    const entries: ChangeEntry[] = [];

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.length < 4) continue;
      const x = seg[0];
      const y = seg[1];
      if (x === " " && y === " ") continue; // 无变更

      let pathStr = seg.slice(3);
      if (x === "R" || x === "C") {
        const oldPath = segments[++i];
        entries.push({ status: "R", path: pathStr, oldPath });
      } else if (x === "?" || y === "?") {
        // 未跟踪文件视为新增
        entries.push({ status: "A", path: pathStr });
      } else if (x === "D" || y === "D") {
        entries.push({ status: "D", path: pathStr });
      } else if (x === "A" || y === "A") {
        entries.push({ status: "A", path: pathStr });
      } else {
        entries.push({ status: "M", path: pathStr });
      }
      if (entries.length >= MAX_FILES) break;
    }

    if (entries.length === 0) {
      return { ok: false, message: "工作区没有未提交的变更", display: "", context: "" };
    }

    // 2) 生成用户可见概览
    const byStatus = { M: [] as string[], A: [] as string[], D: [] as string[], R: [] as string[] };
    for (const e of entries) {
      byStatus[e.status].push(e.status === "R" ? `${e.oldPath} → ${e.path}` : e.path);
    }
    const lines: string[] = [`共 ${entries.length} 个文件变更：`];
    if (byStatus.M.length) lines.push(`✏️ 修改 (${byStatus.M.length}):\n  ` + byStatus.M.join("\n  "));
    if (byStatus.A.length) lines.push(`➕ 新增 (${byStatus.A.length}):\n  ` + byStatus.A.join("\n  "));
    if (byStatus.D.length) lines.push(`🗑 删除 (${byStatus.D.length}):\n  ` + byStatus.D.join("\n  "));
    if (byStatus.R.length) lines.push(`🔄 重命名 (${byStatus.R.length}):\n  ` + byStatus.R.join("\n  "));
    const display = lines.join("\n");

    // 3) 收集 diff 上下文
    const budget = { chars: MAX_TOTAL_CHARS };
    const parts: string[] = [];

    for (const e of entries) {
      if (budget.chars <= 0) break;
      if (e.status === "D") {
        parts.push(`【删除】${e.path}\n（文件已删除）`);
        budget.chars -= parts[parts.length - 1].length;
        continue;
      }
      try {
        let content = "";
        if (e.status === "A") {
          // 新增文件可能是未跟踪（没有 HEAD diff），直接读内容
          content = await this.readUntrackedContent(e.path);
          if (!content) {
            // 已暂存的新增文件，用 diff --cached
            content = await this.runGit(["diff", "--cached", "--", e.path], root);
          }
          if (!content) content = "[无法读取文件内容]";
          parts.push(`【新增】${e.path}\n${this.truncate(content, budget)}`);
        } else {
          const diff = await this.runGit(["diff", "HEAD", "--", e.path], root);
          if (!diff.trim()) {
            // 已暂存但相对 HEAD 无差异（如刚 add 的新文件），退回 cached diff
            const cached = await this.runGit(["diff", "--cached", "--", e.path], root);
            parts.push(`【变更】${e.path}\n${this.truncate(cached || "[无 diff 内容]", budget)}`);
          } else {
            parts.push(`【变更】${e.path}\n${this.truncate(diff, budget)}`);
          }
        }
      } catch {
        parts.push(`【变更】${e.path}\n[无法获取 diff]`);
      }
    }

    return {
      ok: true,
      display,
      context: parts.join("\n\n" + "=".repeat(40) + "\n\n")
    };
  }
}
