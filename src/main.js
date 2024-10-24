import Vue from "vue";

import "normalize.css/normalize.css"; // 一个现代的替代CSS重置

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./permission"; // permission control

import _ from "lodash";

import "./utils/tools/element-ues";

import { API } from "@utils/http/api";

import * as filter from "./utils/filters/filter";

Vue.config.productionTip = false;
Vue.prototype.$_ = _;

/**
 * api请求挂载
 */
 Vue.prototype.$get = API.get;
 Vue.prototype.$post = API.post;
 


//全局过滤器
Object.keys(filter).forEach((key) => {
    Vue.filter(key, filter[key]);
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");