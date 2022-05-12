import request from "@/utils/request";

// 接口名称：修改赛事信息
export function editMatch(data) {
  return request({
    url: "editMatch",
    method: "post",
    data,
  });
}
// 接口名称：新建赛事信息
export function addMatch(data) {
  return request({
    url: "addMatch",
    method: "post",
    data,
  });
}

// 接口名称：获取赛事列表
export function getMatch(data) {
  return request({
    url: "getMatchList",
    method: "post",
    data,
  });
}
// 修改赛事状态
export function editMatchStatus(data) {
  return request({
    url: "editMatchStatus",
    method: "post",
    data,
  });
}
// 删除赛事
export function delMatch(data) {
  return request({
    url: "delMatch",
    method: "post",
    data,
  });
}
// 评委相关
export function getPwList(data) {
  return request({
    url: "getPwList",
    method: "post",
    data,
  });
}
// 修改评委状态
export function setJudgesStatus(data) {
  return request({
    url: "editPwStatus",
    method: "post",
    data,
  });
}
// 删除评委
export function delJudges(data) {
  return request({
    url: "delJudges",
    method: "post",
    data,
  });
}
// 添加评委
export function addJudges(data) {
  return request({
    url: "addJudges",
    method: "post",
    data,
  });
}
//参赛选手
export function matchUserList(data) {
  return request({
    url: "getMatchUserList",
    method: "post",
    data,
  });
}
//备注参赛选手信息
export function setMatchUserRemark(data) {
  return request({
    url: "setMatchUserRemark",
    method: "post",
    data,
  });
}
//设置参赛状态哦
export function setMatchUserStatus(data) {
  return request({
    url: "setMatchUserStatus",
    method: "post",
    data,
  });
}
//筛选分组
export function getSelectGroup() {
  return request({
    url: "getSelectGroup",
    method: "get",
  });
}

//获取筛选分组
export function getSelectMatch(parmas) {
  return request({
    url: "getSelectMatch",
    method: "get",
    parmas,
  });
}
//获取赛事精彩瞬间
export function getMatchImg(data) {
  return request({
    url: "getMatchImg",
    method: "post",
    data,
  });
}
export function getSelectPw(parmas) {
  return request({
    url: "getSelectPw",
    method: "get",
    parmas,
  });
}
export function upMatchImg(data) {
  return request({
    url: "upMatchImg",
    method: "post",
    data,
  });
}
export function matchscoreList(data) {
  return request({
    url: "getMatchScoreList",
    method: "post",
    data,
  });
}

// 赛选条件

export function getSelectMathCity(data) {
  return request({
    url: "getSelectMathCity",
    method: "get",
    data,
  });
}
export function getSelectMathDate(data) {
  return request({
    url: "getSelectMathDate",
    method: "get",
    data,
  });
}
export function getSelectMathCompetition(data) {
  return request({
    url: "getSelectMathCompetition",
    method: "get",
    data,
  });
}
export function getSelectMathGroup(data) {
  return request({
    url: "getSelectMathGroup",
    method: "get",
    data,
  });
}
// 删除
export function delscoreDel(data) {
  return request({
    url: "delscoreDel",
    method: "post",
    data,
  });
}
// 删除
export function delMatchImg(data) {
  return request({
    url: "delMatchImg",
    method: "post",
    data,
  });
}
// 编辑积分
export function editscoreone(data) {
  return request({
    url: "editScore",
    method: "post",
    data,
  });
}
