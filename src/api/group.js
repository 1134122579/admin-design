import request from "@/utils/request";

// 接口名称：修改赛事信息
export function editMatchGroup(data) {
    return request({
        url: "editMatchGroup",
        method: "post",
        data
    });
}
// 接口名称：新建赛事分组信息
export function addMatchGroup(data) {
    return request({
        url: "addMatchGroup",
        method: "post",
        data
    });
}

// 接口名称：获取赛事分组列表
export function getMatchGroupList(data) {
    return request({
        url: "getMatchGroupList",
        method: "post",
        data
    });
}
// 修改赛事分组状态
export function editMatchGroupStatus(data) {
    return request({
        url: "editMatchGroupStatus",
        method: "post",
        data
    });
}
// 删除赛事分组
export function delMatchGroup(data) {
    return request({
        url: "delMatchGroup",
        method: "post",
        data
    });
}
