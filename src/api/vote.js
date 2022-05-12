import request from "@/utils/request";

// 获取参与投票的人数
export function getVoteUserList(data) {
  return request({
    url: "getVoteUserList",
    method: "post",
    data,
  });
}
// 修改用户票数
export function setUserVote(data) {
  return request({
    url: "setUserVote",
    method: "post",
    data,
  });
}
// 获取发起投票列表
export function getVoteList(data) {
  return request({
    url: "getVoteList",
    method: "post",
    data,
  });
}
// 发起投票活动
export function createVote(data) {
  return request({
    url: "createVote",
    method: "post",
    data,
  });
}
// 发起投票活动
export function editVote(data) {
  return request({
    url: "editVote",
    method: "post",
    data,
  });
}
// 修改投票活动状态
export function editVoteStatus(data) {
  return request({
    url: "editVoteStatus",
    method: "post",
    data,
  });
}
//审核参赛人员的状态
export function setVoteStatus(data) {
  return request({
    url: "setVoteStatus",
    method: "post",
    data,
  });
}
//删除活动
export function delVote(data) {
  return request({
    url: "delVote",
    method: "post",
    data,
  });
}
export function setInfo(data) {
  return request({
    url: "editInfo",
    method: "post",
    data,
  });
}
export function getInfo(data) {
  return request({
    url: "getInfo",
    method: "get",
    data,
  });
}
