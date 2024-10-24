/**
 * axios 封装
 */
import axios from "axios";
import { REQUEST_TIMEOUT } from "../../config";
import { Message, Loading } from "element-ui";
let loadingInstance;

// axios.defaults.headers.post["Content-Type"] =
//   "application/x-www-form-urlencoded";

//实例axios
export const API = axios.create({
  baseURL: "/api",
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  // transformRequest: [
  //   function(data, config) {
  //     return Qs.stringify(data);
  //   }
  // ]
});

/**
 * 添加请求拦截器
 */
API.interceptors.request.use(
  function(config) {
    if (!config.headers.isLoading) loadingInstance = Loading.service();

    // if (sessionStorage.getItem("userInfo"))
    //     config.headers.userId = JSON.parse(sessionStorage.getItem("userInfo")).Id;
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    Message.error("请求错误，请稍后重试！");
    return Promise.reject(error);
  }
);

/**
 * 添加响应拦截器
 */
API.interceptors.response.use(
  function(response) {
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }

    if (response.config.responseType === "blob")
      return handleResponse(response, response.config.fileName);

    switch (response.data.code) {
      case 200:
        if (response.data.data.status) {
          return response;
        } else {
          Message.error(response.data.data.err || "");
          return response;
        }

      case 401:
        Message.error("未登录!");
        break;

      case 500:
        Message.error("内部服务器错误!");
        break;

      default:
        Message.error("网络错误，请稍后重试2！");
    }
  },
  function(error) {
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }

    // 对响应错误做点什么
    // if (error.message.includes("timeout")) {
    //     // 判断请求异常信息中是否含有超时timeout字符串
    //     Message.error("网络超时，请重试！");
    // }

    // 对响应错误做点什么
    if (error.response.status == 401 || error.response.status == 404) {
      window.location.href = "/#/login?type=past";
      // Message.error("请重新登录！");
    } else {
      Message.error("内部服务器错误");
    }

    return Promise.reject(error);
  }
);

/**
 * 处理响应的二进字数据
 * @param {*} response
 */
function handleResponse(response, name) {
  const responseBody = response.data;
  let fileName = "yb_" + new Date().getTime() + ".xlsx";

  if (name) fileName = "yb_" + name + ".xlsx";

  try {
    const blob = new Blob([responseBody]);
    if ("download" in document.createElement("a")) {
      // 非IE下载
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob); //创建下载
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName);
    }
  } catch (e) {}
}
