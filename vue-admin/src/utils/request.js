import axios from "axios";
import { Message } from "element-ui";

const BASEURL = process.env.NODE_ENV === "production" ? "/api" : "/api";
// 创建axios
const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000 // 15秒
  // headers: {'X-Custom-Header': 'foobar'}
});

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    // 请求发送之前处理的事
    return config;
  },
  function(error) {
    // 请求错误处理
    return Promoise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function(response) {
    // 对响应数据处理
    let data = response.data;

    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promoise.reject(data);
    } else {
      return response;
      return Promoise.resolve(data);
    }
  },
  function(error) {
    // 对响应错误处理
    return Promoise.reject(error);
  }
);

export default service;
