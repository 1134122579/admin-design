import request from "@/utils/request";

// 上传广告封面
export function addAdvert(data) {
  return request({
    url: "addAdvert",
    method: "post",
    data,
  });
}

export function setAdvertStatus(data) {
  return request({
    url: "setAdvertStatus",
    method: "post",
    data,
  });
}
export function editAdvert(data) {
  return request({
    url: "editAdvert",
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
export function getAdvert(data) {
  return request({
    url: "getAdvert",
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
