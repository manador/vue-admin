import service from "@/utils/request";

/**
 * 注册
 */
export function userRegister(data) {
  return service.request({
    method: "post",
    url: "/register/",
    data
  });
}

/**
 * 登录
 */
export function userLogin(data) {
  return service.request({
    method: "post",
    url: "/login/",
    data
  });
}

/**
 * 获取验证码
 */
export function getSms(data) {
  return service.request({
    method: "post",
    url: "/getSms/",
    data
  });
}
