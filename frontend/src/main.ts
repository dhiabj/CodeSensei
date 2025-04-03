import "./assets/main.css";

import { createApp } from "vue";
import { basicSetup } from "codemirror";
import VueCodemirror from "vue-codemirror";
import App from "./App.vue";

const app = createApp(App);

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
