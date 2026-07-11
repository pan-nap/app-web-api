import { defineStore } from "pinia";
import { Utils } from "hs-admin-ui";

export const useEmployeeStore = defineStore("employee", () => {
  const getList = async (params: any = {}) => {
    return Utils.useRequest("/sf-web/employee", params, "get");
  };

  const getById = async (id: string) => {
    return Utils.useRequest(`/sf-web/employee/${id}`, {}, "get");
  };

  const create = async (data: any) => {
    return Utils.useRequest("/sf-web/employee", data, "post");
  };

  const update = async (id: string, data: any) => {
    return Utils.useRequest(`/sf-web/employee/${id}`, data, "put");
  };

  const deleteById = async (id: string) => {
    return Utils.useRequest(`/sf-web/employee/${id}`, {}, "delete");
  };

  const batchDelete = async (ids: string[]) => {
    return Utils.useRequest("/sf-web/employee/batch/delete", { ids }, "post");
  };

  return { getList, getById, create, update, deleteById, batchDelete };
});