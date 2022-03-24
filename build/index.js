"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var showStatus = function (status) {
    var mes = "";
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
            mes = "\u8FDE\u63A5\u51FA\u9519(".concat(status, ")!");
    }
    return "".concat(mes, "\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u8054\u7CFB\u7BA1\u7406\u5458\uFF01");
};
var service = axios_1.default.create({
    // 判断环境
    baseURL: process.env.NODE_ENV === "production" ? "/" : "/apis",
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
        function (data) {
            data = JSON.stringify(data);
            return data;
        }
    ],
    validateStatus: function () {
        // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
        return true;
    },
    transformResponse: [
        function (data) {
            if (typeof data === "string" && data.startsWith("{")) {
                data = JSON.parse(data);
            }
            return data;
        }
    ]
});
// 请求拦截器
service.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    // 错误抛到业务代码
    error.data = {};
    error.data.msg = "服务器异常，请联系管理员！";
    return Promise.resolve(error);
});
// 响应拦截器
service.interceptors.response.use(function (response) {
    var status = response.status;
    var msg = "";
    if (status < 200 || status >= 300) {
        // 处理http错误，抛到业务代码,这里的状态码可以为data里面的业务具体的状态码
        msg = showStatus(status);
        if (typeof response.data === "string") {
            response.data = { msg: msg };
        }
        else {
            response.data.msg = msg;
        }
    }
    return response;
}, function (error) {
    // 错误抛到业务代码，这里的状态码为http所规定的状态码
    error.data = {};
    error.data.msg = "请求超时或服务器异常，请检查网络或联系管理员！";
    return Promise.resolve(error);
});
exports.default = service;
