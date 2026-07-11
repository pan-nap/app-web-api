import { defineStore } from "pinia";
import { Utils } from "hs-admin-ui";

export const useOrderStore = defineStore("order", () => {
  const getList = async (params: any = {}) => {
    return Utils.useRequest("/sf-web/order", params, "get");
  };

  const getById = async (id: string) => {
    return Utils.useRequest(`/sf-web/order/${id}`, {}, "get");
  };

  const create = async (data: any) => {
    return Utils.useRequest("/sf-web/order", data, "post");
  };

  const update = async (id: string, data: any) => {
    return Utils.useRequest(`/sf-web/order/${id}`, data, "put");
  };

  const deleteById = async (id: string) => {
    return Utils.useRequest(`/sf-web/order/${id}`, {}, "delete");
  };

  const batchDelete = async (ids: string[]) => {
    return Utils.useRequest("/sf-web/order/batch/delete", { ids }, "post");
  };

  const generatePayCode = async (orderId: string) => {
    return Utils.useRequest(`/sf-web/order/${orderId}/pay-code`, {}, "post");
  };

  const addStudents = async (orderId: string, studentIds: string[]) => {
    return Utils.useRequest("/sf-web/order/add-students", { orderId, studentIds }, "post");
  };

  const removeStudent = async (orderId: string, studentId: string) => {
    return Utils.useRequest("/sf-web/order/remove-student", { orderId, studentId }, "post");
  };

  const getItems = async (orderId: string) => {
    return Utils.useRequest(`/sf-web/order/${orderId}/items`, {}, "get");
  };

  const updateItem = async (id: string, data: any) => {
    return Utils.useRequest(`/sf-web/order/item/${id}`, data, "put");
  };

  return { getList, getById, create, update, deleteById, batchDelete, generatePayCode, addStudents, removeStudent, updateItem, getItems };
});
