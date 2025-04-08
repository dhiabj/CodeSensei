import "./assets/main.css";
import { createApp } from "vue";
import { basicSetup } from "codemirror";
import VueCodemirror from "vue-codemirror";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
});

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(Toast);

app.use(VueCodemirror, {
  // optional default global options
  autofocus: true,
  disabled: false,
  indentWithTab: true,
  tabSize: 2,
  placeholder: "Code goes here...",
  extensions: [basicSetup],
  // ...
});

app.mount("#app");
