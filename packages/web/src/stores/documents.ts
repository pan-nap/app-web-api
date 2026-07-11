import { defineStore } from "pinia";
import { Utils } from "hs-admin-ui";
import type { DocumentRecord } from "@/types/emr";

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

  return { getList, getById, create, update, deleteById, batchDelete };
});
