import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import inspector from "vite-plugin-vue-inspector";

const resolve = (src: string) => fileURLToPath(new URL(src, import.meta.url));

export default defineConfig((mode) => {
  return {
    plugins: [vue(), vueDevTools(), inspector()],
    resolve: {
      alias: {
        "@": resolve("./src")
      }
    },
    css: {
      charset: false,
      postcss: {
        plugins: [tailwindcss]
      }
    },
    server: {
      host: "0.0.0.0",
      port: 8090,
      proxy: {
        "/sf-web": {
          target: "http://localhost:3001/",
          rewrite: (path) => path.replace(/^\/sf-web/, ""),
          changeOrigin: true
        }
      }
    },
    define: {
      __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
      __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
      __IS_DEV__: JSON.stringify(mode.command === "serve")
    }
  };
});
