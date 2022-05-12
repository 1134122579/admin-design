import request from "@/utils/request";

// 上传广告封面
export function addSahreArticle(data) {
  return request({
    url: "addSahreArticle",
    method: "post",
    data,
  });
}

export function setShareArticleStatus(data) {
  return request({
    url: "setShareArticleStatus",
    method: "post",
    data,
  });
}
export function editSahreArticle(data) {
  return request({
    url: "editSahreArticle",
    method: "post",
    data,
  });
}
export function delShareArticle(data) {
  return request({
    url: "delShareArticle",
    method: "post",
    data,
  });
}
export function getShareUrl(data) {
  return request({
    url: "getShareUrl",
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
