import { describe, it, expect } from "vitest";
import { gridOptions } from "../gridOptions";

describe("员工管理 - gridOptions", () => {
  it("应该有正确的结构", () => {
    expect(gridOptions).toBeDefined();
    expect(gridOptions.columns).toBeDefined();
    expect(Array.isArray(gridOptions.columns)).toBe(true);
    expect(gridOptions.pagerConfig).toBeDefined();
  });

  it("应该有必填列", () => {
    const columnFields = gridOptions.columns!.map((col) => col.field);
    expect(columnFields).toContain("username");
    expect(columnFields).toContain("name");
    expect(columnFields).toContain("phone");
    expect(columnFields).toContain("email");
    expect(columnFields).toContain("role");
    expect(columnFields).toContain("status");
  });

  it("应该有操作列", () => {
    const actionColumn = gridOptions.columns!.find((col) => col.field === "setting");
    expect(actionColumn).toBeDefined();
    expect(actionColumn?.slots).toBeDefined();
    expect(actionColumn?.slots?.default).toBe("setting");
  });

  it("应该有复选框列", () => {
    const checkboxColumn = gridOptions.columns!.find((col) => String(col.type) === "checkbox");
    expect(checkboxColumn).toBeDefined();
  });

  it("应该有状态列", () => {
    const statusColumn = gridOptions.columns!.find((col) => col.field === "status");
    expect(statusColumn).toBeDefined();
    expect(statusColumn?.slots).toBeDefined();
    expect(statusColumn?.slots?.default).toBe("status_default");
  });

  it("应该有正确的分页配置", () => {
    expect(gridOptions.pagerConfig?.currentPage).toBe(1);
    expect(gridOptions.pagerConfig?.pageSize).toBe(20);
  });

  it("应该配置正确的接口地址", () => {
    expect(gridOptions.url).toBe("/sf-web/employee");
  });
});