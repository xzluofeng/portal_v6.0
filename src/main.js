/*
 * @Author: Jason Liu
 * @Date: 2022-03-17 09:14:59
 * @Desc:
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入美化时间包
import dayjs from "dayjs";
import "default-passive-events";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "amfe-flexible/index.js"; // 做rem适配的

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import "./themes";

import API from "@/api/index";

/**
 * 封装全局自定义库
 * **/
// 日期处理插件
import moment from "moment";
import "moment/locale/zh-cn";
Vue.prototype.$moment = moment;

Vue.prototype.$api = API;

Vue.use(ElementUI, { size: "medium", zIndex: 3000 });
// 网络请求

// 本地存储
Vue.prototype.$storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

Vue.prototype.$store = store;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
