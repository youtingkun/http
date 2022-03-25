
import axios, { AxiosRequestConfig, AxiosResponse,AxiosInstance } from "axios";

const showStatus = (status:Number) => {
  let mes = "";
  switch (status) {
    case 400:
      mes = "请求错误(400)";
      break;
    case 401:
      mes = "未授权，请重新登录(401)";
      break;
    case 403:
      mes = "拒绝访问(403)";
      break;
    case 404:
      mes = "请求出错(404)";
      break;
    case 408:
      mes = "请求超时(408)";
      break;
    case 500:
      mes = "服务器错误(500)";
      break;
    case 501:
      mes = "服务未实现(501)";
      break;
    case 502:
      mes = "网络错误(502)";
      break;
    case 503:
      mes = "服务不可用(503)";
      break;
    case 504:
      mes = "网络超时(504)";
      break;
    case 505:
      mes = "HTTP版本不受支持(505)";
      break;
    default:
      mes = `连接出错(${status})!`;
  }
  return `${mes}，请检查网络或联系管理员！`;
};

const service:AxiosInstance = axios.create({
  // 判断环境
  baseURL: process.env.NODE_ENV === "production" ? `/` : "/apis",
  headers: {
    // get: {
    //   "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    // },
    // post: {
    //   "Content-Type": "application/json;charset=utf-8"
    // }
  },
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 30000,
  transformRequest: [
    data => {
      data = JSON.stringify(data);
      return data;
    }
  ],
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
  transformResponse: [
    data => {
      if (typeof data === "string" && data.startsWith("{")) {
        data = JSON.parse(data);
      }
      return data;
    }
  ]
});

// 请求拦截器
service.interceptors.request.use(
  (config:AxiosRequestConfig) => {
    return config;
  },
  error => {
    // 错误抛到业务代码
    error.data = {};
    error.data.msg = "服务器异常，请联系管理员！";
    return Promise.resolve(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response:AxiosResponse) => {
    const status = response.status;
    let msg = "";
    if (status < 200 || status >= 300) {
      // 处理http错误，抛到业务代码,这里的状态码可以为data里面的业务具体的状态码
      msg = showStatus(status);
      if (typeof response.data === "string") {
        response.data = { msg };
      } else {
        response.data.msg = msg;
      }
    }
    return response;
  },
  error => {
    // 错误抛到业务代码，这里的状态码为http所规定的状态码
    error.data = {};
    error.data.msg = "请求超时或服务器异常，请检查网络或联系管理员！";
    return Promise.resolve(error);
  }
);

export default service;
