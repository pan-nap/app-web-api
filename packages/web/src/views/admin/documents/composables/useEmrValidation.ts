/**
 * useEmrValidation — 编辑器保存前置校验 composable
 *
 * 适配 Tiptap/ProseMirror JSON 格式：
 *   变量节点：{ type: "variable", attrs: { varKey, varLabel, varValue, required } }
 *   区块节点：{ type: "medicalBlock", attrs: { blockId, blockName, required }, content: [...] }
 */

import type { EmrElement } from "@/types/emr"

export interface ValidationError {
  type: "variable" | "block"
  key: string
  label: string
  message: string
}

export function useEmrValidation() {
  /**
   * 校验编辑器内容
   * @returns 空数组表示通过，非空表示校验失败
   */
  function validate(doc: EmrElement[]): ValidationError[] {
    const errors: ValidationError[] = []

    function traverse(node: any): void {
      if (!node) return
      if (Array.isArray(node)) {
        node.forEach(traverse)
        return
      }
      if (typeof node !== "object") return

      // 检查必填变量是否填充（Tiptap 自定义节点 attrs 中取值）
      if (node.type === "variable" && node.attrs?.required) {
        const varValue = node.attrs?.varValue || ""
        if (!varValue.trim()) {
          errors.push({
            type: "variable",
            key: node.attrs.varKey,
            label: node.attrs.varLabel || node.attrs.varKey,
            message: `变量"${node.attrs.varLabel}"为必填项，请填充值`
          })
        }
      }

      // 检查必填区块内容是否为空
      if (node.type === "medicalBlock" && node.attrs?.required) {
        const hasContent = (node.content || []).some((child: any) => {
          if (child.type === "paragraph" && child.content) {
            return child.content.some((c: any) =>
              c.type === "text" && c.text?.trim().length > 0
            )
          }
          return true
        })
        if (!hasContent) {
          errors.push({
            type: "block",
            key: node.attrs.blockId,
            label: node.attrs.blockName,
            message: `"${node.attrs.blockName}"为必填区块，请输入内容`
          })
        }
      }

      // ProseMirror 子节点在 content 字段中
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse)
      }
    }

    traverse(doc)
    return errors
  }

  return { validate }
}
