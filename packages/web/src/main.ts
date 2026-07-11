import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { Utils, useHsAdminUi } from "hs-admin-ui";
import { setupRouter, default as router } from "./router";
import "hs-admin-ui/style.css";
import "./style.css";

const app = createApp(App);

app
  .use(createPinia())
  .use(Utils.message)
  .use(Utils.notification)
  .use(Utils.messageBox)
  .use(useHsAdminUi, {
    NEXT_NAME: __NEXT_NAME__,
    IS_DEV: __IS_DEV__,
    currentRoute: router.currentRoute,
    currentRouter: router
  })
  .use(Utils.popupPlugin, {
    width: 1000,
    height: 600,
    lockView: true,
    mask: false,
    maskClosable: false,
    destroyOnClose: true,
    escClosable: true,
    showZoom: false,
    resize: true
  });
setupRouter(app).then(() => {
  app.mount("#app");
});
