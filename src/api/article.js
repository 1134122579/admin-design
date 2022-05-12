import request from "@/utils/request";

// 上传视频
export function addArticle(data) {
  return request({
    url: "addArticle",
    method: "post",
    data,
  });
}
// 获取广告列表
export function getAdvertSelect() {
  return request({
    url: "getAdvertSelect",
    method: "get",
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
export function setArticleStatus(data) {
  return request({
    url: "setArticleStatus",
    method: "post",
    data,
  });
}
export function editArticle(data) {
  return request({
    url: "editArticle",
    method: "post",
    data,
  });
}
export function delArticle(data) {
  return request({
    url: "delArticle",
    method: "post",
    data,
  });
}
export function getArticle(data) {
  return request({
    url: "getArticle",
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
export function getVideoList(params) {
  return request({
    url: "getSelectVideo",
    method: "get",
    params,
  });
}
