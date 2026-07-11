<template>
  <el-container class="h-screen overflow-hidden">
    <el-aside width="200px" class="bg-[#304156] border-r-0">
      <div class="h-[60px] leading-[60px] text-center text-white text-lg font-bold bg-[#2b3a4a]">后台系统</div>
      <el-menu :default-active="activeMenu" background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff" router>
        <el-menu-item v-for="route in menuRoutes" :key="route.path" :index="route.fullPath">
          <span>{{ route.meta?.title }}</span>
        </el-menu-item>
        <el-menu-item @click="handleLogout">
          <span>退出登录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="bg-[#f0f2f5] h-full">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter, type RouteRecordRaw } from "vue-router";
import { HsMessageBox } from "hs-admin-ui";
import { useUserStore } from "@/stores/user";
import routes from "@/router/route";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const menuRoutes = computed(() => {
  const adminRoute = routes.find((r) => r.path === "/admin") as RouteRecordRaw;
  const children = adminRoute?.children || [];

  return children.map((child) => ({
    ...child,
    fullPath: `/admin/${child.path}`
  }));
});

const activeMenu = computed(() => route.path);

const handleLogout = async () => {
  await HsMessageBox.confirm("确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  });
  await userStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.el-main {
  --el-main-padding: 0;
}
.el-menu {
  border-right: none;
}
</style>
