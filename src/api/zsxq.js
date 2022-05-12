import request from "@/utils/request";

// 添加知识星球
export function addPyq(data) {
  return request({
    url: "addPyq",
    method: "post",
    data,
  });
}
export function setPyqStatus(data) {
  return request({
    url: "setPyqStatus",
    method: "post",
    data,
  });
}
export function editPyq(data) {
  return request({
    url: "editPyq",
    method: "post",
    data,
  });
}
export function delAdvert(data) {
  return request({
    url: "delAdvert",
    method: "post",
    data,
  });
}
export function getPyq(data) {
  return request({
    url: "getPyq",
    method: "post",
    data,
  });
}
export function getQiniuToken(params) {
  return request({
    url: "getQiniuToken",
    method: "get",
    params,
  });
}
