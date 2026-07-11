import { defineStore } from "pinia";
import { Utils } from "hs-admin-ui";
import { useDictionaryStore } from "@/stores/dictionary";

export const useUserStore = defineStore("user", () => {
  const isLoggedIn = async () => {
    const userInfo = await Utils.systemStore.get("userInfo");
    return !!userInfo?.access_token;
  };

  const login = async (username: string, password: string) => {
    return Utils.useRequest("/sf-web/login", { username, password }, "post").then(async (res) => {
      await Utils.systemStore.set("userInfo", res.data);
      return useDictionaryStore().fetchDictionaries();
    });
  };

  const logout = () => {
    return Utils.useRequest("/sf-web/logout", { title: "退出登录" }, "post").then(() => Utils.systemStore.remove("userInfo"));
  };

  return { isLoggedIn, login, logout };
});
