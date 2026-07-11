<template>
  <div class="login-container">
    <div class="hero-band">
      <div class="hero-content">
        <div class="logo-section">
          <div class="logo-badge"></div>
          <span class="brand-text">收银管理系统</span>
        </div>
        <h1 class="hero-title">欢迎登录</h1>
        <p class="hero-subtitle">Student Financial Management System</p>
        <div class="hero-cta">
          <span class="cta-text">高效管理 · 便捷服务</span>
        </div>
      </div>
    </div>

    <div class="form-container">
      <div class="login-card">
        <div class="card-header">
          <h2 class="card-title">账户登录</h2>
          <p class="card-subtitle">请输入您的账号信息</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入账号" class="form-input" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" class="form-input" @keyup.enter="handleLogin" />
          </el-form-item>

          <el-form-item>
            <bc-button type="primary" class="btn-primary" @click="handleLogin"> 登 录 </bc-button>
          </el-form-item>
        </el-form>

        <div class="card-footer">
          <span class="footer-text">© 2024 收银管理系统</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { HsMessage } from "hs-admin-ui";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();
const formRef = ref();

const form = reactive({
  username: "admin",
  password: "123456"
});

const rules = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
};

const handleLogin = async () => {
  await formRef.value.validate();
  await userStore.login(form.username, form.password);
  HsMessage.success("登录成功");
  router.push("/admin/student");
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
}

.hero-band {
  width: 55%;
  background: linear-gradient(180deg, #272729 0%, #2a2a2c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  text-align: center;
  color: #ffffff;
  z-index: 1;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.logo-badge {
  width: 56px;
  height: 56px;
  background-color: #0066cc;
  border-radius: 50%;
  position: relative;
}

.logo-badge::before {
  content: "S";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
}

.brand-text {
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 0.231px;
}

.hero-title {
  font-size: 56px;
  font-weight: 600;
  margin: 0 0 16px 0;
  line-height: 1.07;
  letter-spacing: -0.28px;
}

.hero-subtitle {
  font-size: 28px;
  font-weight: 400;
  color: #cccccc;
  margin: 0 0 24px 0;
  line-height: 1.14;
  letter-spacing: 0.196px;
}

.hero-cta {
  margin-top: 16px;
}

.cta-text {
  font-size: 17px;
  font-weight: 400;
  color: #2997ff;
  letter-spacing: -0.374px;
}

.form-container {
  width: 45%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.card-title {
  font-size: 34px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px 0;
  line-height: 1.47;
  letter-spacing: -0.374px;
}

.card-subtitle {
  font-size: 17px;
  font-weight: 400;
  color: #7a7a7a;
  margin: 0;
  line-height: 1.47;
  letter-spacing: -0.374px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.form-input {
  height: 44px;
  padding: 12px 20px;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  color: #1d1d1f;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.47;
  letter-spacing: -0.374px;
  transition: border-color 0.2s ease;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 9999px;
  box-shadow: none;
}

.login-form :deep(.el-input__wrapper):hover {
  box-shadow: none;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border-color: #0066cc;
}

.login-form :deep(.el-input__inner) {
  height: 44px;
  line-height: 44px;
  border-radius: 9999px;
  font-size: 17px;
  font-weight: 400;
}

.form-input.input-error {
  border-color: #dc2626 !important;
}

.error-message {
  font-size: 12px;
  font-weight: 400;
  color: #dc2626;
  line-height: 1;
  margin-top: 4px;
  display: block;
  letter-spacing: -0.12px;
}

.btn-primary {
  width: 100%;
  height: 44px;
  padding: 11px 22px;
  background-color: #0066cc;
  color: #ffffff;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.374px;
  border-radius: 9999px;
  border: none;
  transition: all 0.2s ease;
}

.login-form :deep(.btn-primary) {
  width: 100%;
  height: 44px;
  border-radius: 9999px;
}

.login-form :deep(.btn-primary:hover) {
  background-color: #0071e3;
}

.login-form :deep(.btn-primary:active) {
  transform: scale(0.98);
}

.login-form :deep(.btn-primary:disabled) {
  background-color: #e0e0e0;
  color: #7a7a7a;
}

.card-footer {
  margin-top: 32px;
  text-align: center;
}

.footer-text {
  font-size: 12px;
  font-weight: 400;
  color: #7a7a7a;
  line-height: 1;
  letter-spacing: -0.12px;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .hero-band {
    width: 100%;
    padding: 48px 24px;
  }

  .hero-title {
    font-size: 34px;
    letter-spacing: -0.374px;
  }

  .hero-subtitle {
    font-size: 21px;
  }

  .form-container {
    width: 100%;
    padding: 48px 24px;
  }

  .login-card {
    padding: 24px;
  }

  .card-title {
    font-size: 28px;
  }
}
</style>
