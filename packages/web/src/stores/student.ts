import { defineStore } from "pinia";
import { Utils } from "hs-admin-ui";

export const useStudentStore = defineStore("student", () => {
  const getList = async (params: any = {}) => {
    return Utils.useRequest("/sf-web/student", params, "get");
  };

  const getById = async (id: string) => {
    return Utils.useRequest(`/sf-web/student/${id}`, {}, "get");
  };

  const create = async (data: any) => {
    return Utils.useRequest("/sf-web/student", data, "post");
  };

  const update = async (id: string, data: any) => {
    return Utils.useRequest(`/sf-web/student/${id}`, data, "put");
  };

  const deleteById = async (id: string) => {
    return Utils.useRequest(`/sf-web/student/${id}`, {}, "delete");
  };

  const batchDelete = async (ids: string[]) => {
    return Utils.useRequest("/sf-web/student/batch/delete", { ids }, "post");
  };

  const batchUpdate = async (data: any) => {
    return Utils.useRequest("/sf-web/student/batch", data, "put");
  };

  return { getList, getById, create, update, deleteById, batchDelete, batchUpdate };
});
