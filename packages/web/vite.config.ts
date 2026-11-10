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
    worker: {
      format: "es"
    },
    optimizeDeps: {
      exclude: ["@cornerstonejs/dicom-image-loader"],
      include: [
        "@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-charls/decodewasmjs",
        "@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-libjpeg-turbo-8bit/decodewasmjs",
        "@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-libjxl/decodewasmjs",
        "@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-openjpeg/decodewasmjs",
        "@cornerstonejs/dicom-image-loader > @cornerstonejs/codec-openjph/wasmjs",
        "@cornerstonejs/dicom-image-loader > @cornerstonejs/jpeg-lossless-decoder-js",
        "@cornerstonejs/dicom-image-loader > comlink",
        "@cornerstonejs/dicom-image-loader > dicom-parser",
        "@cornerstonejs/dicom-image-loader > pako",
        "@cornerstonejs/dicom-image-loader > uuid"
      ]
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
