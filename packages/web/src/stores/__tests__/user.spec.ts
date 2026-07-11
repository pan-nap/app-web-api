import { setActivePinia, createPinia } from "pinia";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useUserStore } from "../user";

vi.mock("hs-admin-ui", () => ({
  Utils: {
    useRequest: vi.fn(),
    systemStore: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn()
    }
  }
}));

vi.mock("@/stores/dictionary", () => ({
  useDictionaryStore: () => ({
    fetchDictionaries: vi.fn().mockResolvedValue({})
  })
}));

const { Utils } = await import("hs-admin-ui");

describe("用户Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("isLoggedIn 应在 userInfo 存在 access_token 时返回 true", async () => {
    const store = useUserStore();
    (Utils.systemStore.get as any).mockResolvedValue({ access_token: "abc123" });

    const result = await store.isLoggedIn();

    expect(Utils.systemStore.get).toHaveBeenCalledWith("userInfo");
    expect(result).toBe(true);
  });

  it("isLoggedIn 应在 userInfo 不存在时返回 false", async () => {
    const store = useUserStore();
    (Utils.systemStore.get as any).mockResolvedValue(null);

    const result = await store.isLoggedIn();

    expect(result).toBe(false);
  });

  it("isLoggedIn 应在 userInfo 为空对象时返回 false", async () => {
    const store = useUserStore();
    (Utils.systemStore.get as any).mockResolvedValue({});

    const result = await store.isLoggedIn();

    expect(result).toBe(false);
  });

  it("login 应调用 Utils.useRequest 并设置 userInfo", async () => {
    const store = useUserStore();
    const loginData = { username: "admin", password: "123456" };
    const mockResponse = { data: { access_token: "abc123", user: { name: "管理员" } } };
    (Utils.useRequest as any).mockResolvedValue(mockResponse);
    (Utils.systemStore.set as any).mockResolvedValue(undefined);

    const result = await store.login(loginData.username, loginData.password);

    expect(Utils.useRequest).toHaveBeenCalledWith("/sf-web/login", loginData, "post");
    expect(Utils.systemStore.set).toHaveBeenCalledWith("userInfo", mockResponse.data);
  });

  it("logout 应调用 Utils.useRequest 并移除 userInfo", async () => {
    const store = useUserStore();
    (Utils.useRequest as any).mockResolvedValue({ data: null });

    await store.logout();

    expect(Utils.useRequest).toHaveBeenCalledWith("/sf-web/logout", { title: "退出登录" }, "post");
    expect(Utils.systemStore.remove).toHaveBeenCalledWith("userInfo");
  });
});
