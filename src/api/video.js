import request from "@/utils/request";

// 上传视频
export function addVideo(data) {
  return request({
    url: "addVideo",
    method: "post",
    data,
  });
}
// 获取视频号列表
export function getVideo(data) {
  return request({
    url: "getVideo",
    method: "post",
    data,
  });
}
export function setVideoStatus(data) {
  return request({
    url: "setVideoStatus",
    method: "post",
    data,
  });
}
export function editVideo(data) {
  return request({
    url: "editVideo",
    method: "post",
    data,
  });
}
export function delVideo(data) {
  return request({
    url: "delVideo",
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
