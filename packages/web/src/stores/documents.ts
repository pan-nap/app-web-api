import { defineStore } from "pinia";
import { Utils } from "hs-admin-ui";
import type { DocumentRecord } from "@cashier/emr";

export const useDocumentStore = defineStore("document", () => {
  const getList = async (params: any = {}) => {
    return Utils.useRequest("/sf-web/document", params, "get");
  };

  const getById = async (id: string) => {
    return Utils.useRequest(`/sf-web/document/${id}`, {}, "get");
  };

  const create = async (data: Partial<DocumentRecord>) => {
    return Utils.useRequest("/sf-web/document", data, "post");
  };

  const update = async (id: string, data: Partial<DocumentRecord>) => {
    return Utils.useRequest(`/sf-web/document/${id}`, data, "put");
  };

  const deleteById = async (id: string) => {
    return Utils.useRequest(`/sf-web/document/${id}`, {}, "delete");
  };

  const batchDelete = async (ids: string[]) => {
    return Utils.useRequest("/sf-web/document/batch/delete", { ids }, "post");
  };

  /** 获取文书变量值映射 { varKey: varValue } */
  const getValues = async (id: string): Promise<Record<string, string>> => {
    return Utils.useRequest(`/sf-web/document/${id}/values`, {}, "get");
  };

  /** 获取文书模板结构内容（客户动态数据与模板分离，由变量值接口承载） */
  const getTemplate = async (id: string): Promise<any> => {
    return Utils.useRequest(`/sf-web/document/${id}/template`, {}, "get");
  };

  /** 批量保存文书变量值 */
  const saveValues = async (id: string, values: Record<string, string>) => {
    return Utils.useRequest(`/sf-web/document/${id}/values`, values, "put");
  };

  return { getList, getById, create, update, deleteById, batchDelete, getValues, getTemplate, saveValues };
});
