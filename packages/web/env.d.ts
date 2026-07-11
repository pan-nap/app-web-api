/// <reference types="vite/client" />

declare const __IS_DEV__: boolean;
declare const __NEXT_NAME__: string;

// 声明文件，*.vue 后缀的文件交给 vue 模块来处理
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
