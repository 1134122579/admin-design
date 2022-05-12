import request from "@/utils/request";
// 获取动态列表
export function getDynamicList(data) {
    return request({
        url: "getDynamicList",
        method: "post",
        data
    });
}
// 审核动态状态
export function editDynamicStatus(data) {
    return request({
        url: "editDynamicStatus",
        method: "post",
        data
    });
}
// 动态备注
export function setDynamicRemark(data) {
    return request({
        url: "setDynamicRemark",
        method: "post",
        data
    });
}
