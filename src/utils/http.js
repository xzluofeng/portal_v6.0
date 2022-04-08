import axios from "axios";
import { Loading, Message } from "element-ui";
import "@/styles/element-ui.scss";
import qs from "qs";
import store from "@/store/index";
// import { debounce } from './tools'

const service = axios.create({
  // 根据环境来配置基地址，(其实无跨域都是p)
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: config.http.capiBaseURL
  timeout: 30000,
});

// 设置请求loading效果
let loading;
const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: "",
    background: "transparent",
  });
};
const endLoading = () => {
  loading.close();
};

// 设置请求拦截器和响应拦截器
service.interceptors.request.use(
  (config) => {
    if (store.state.token) {
      config.headers.Authorization = store.state.token;
    }
    // 设置Loading动画展示
    startLoading();
    return config;
  },
  (error) => {
    endLoading();
    Message.error({ message: error.message }); // 提示错误消息
    return Promise.resolve(error);
  }
);
service.interceptors.response.use(
  (response) => {
    // // 关闭Loading动画
    endLoading();
    return response;
  },
  (error) => {
    endLoading();
    if (error.response && error.response.status === 500) {
      Message.error({ message: "服务器异常，请稍后重试！" });
    } else if (error.response && error.response.status === 408) {
      Message.error({ message: "链接超时，请稍后重试！" });
    } else {
      Message.error({ message: "未知错误,请重试！" });
    }
    console.log(JSON.stringify(error));
    return Promise.reject(error);
  }
);

const headerConfig = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/x-www-form-urlencoded",
  "Access-Control-Allow-Origin": "*",
};

/**
 * 封装post方法 !!老接口地址 端口号8762
 * @param url
 * @param data
 * @returns {Promise}
 */
export const postOld = (url, params = {}) => {
  // 打包后的地址
  const postUrl = window.CONFIG.baseUrl1 + url;

  return new Promise((resolve, reject) => {
    service
      .post(postUrl, qs.stringify(params), {
        headers: headerConfig,
      })
      .then(
        (response) => {
          if (response) {
            // 注意200是数字类型
            if (response.data && response.data.status === 200) {
              resolve(response.data);
            } else {
              // 如果状态码不是200，返回状态错误的提示
              Message.error(response.data.message);
            }
          } else {
            // 没有response显示这个
            console.log("= no data =");
          }
        },
        (error) => {
          reject(error);
        }
      );
  });
};

/**
 * 封装post方法 新接口地址baseUrl2 端口号8201
 * @param url
 * @param data
 * @returns {Promise}
 */
export const post = (url, params = {}) => {
  // 打包后的地址
  const postUrl = window.CONFIG.baseUrl2 + url;

  return new Promise((resolve, reject) => {
    service
      .post(postUrl, qs.stringify(params), {
        headers: headerConfig,
      })
      .then(
        (response) => {
          if (response) {
            // 注意200是数字类型
            if (response.data && response.data.status === 200) {
              resolve(response.data);
            } else {
              // 如果状态码不是200，返回状态错误的提示
              Message.fail(response.data.message);
            }
          } else {
            // 没有response显示这个
            console.log("= no data =");
          }
        },
        (error) => {
          reject(error);
        }
      );
  });
};

/**
 * 封装get方法 新接口地址baseUrl2
 * @param url
 * @param data
 * @returns {Promise}
 */
export const get = (url, params = {}) => {
  // 打包后的地址
  const postUrl = window.CONFIG.baseUrl2 + url;

  return new Promise((resolve, reject) => {
    service
      .get(postUrl, {
        params: params,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
