import request from '@/utils/request'

// 获取地点列表
export function getShopList(data) {
    return request({
        url: 'getShopList',
        method: 'post',
        data
    })
}
// 添加门店
export function addShop(data) {
    return request({
        url: 'addShop',
        method: 'post',
        data
    })
}
//修改门店
export function editShop(data) {
    return request({
        url: 'editShop',
        method: 'post',
        data
    })
}
//修改门店
export function delShop(data) {
    return request({
        url: 'delShop',
        method: 'post',
        data
    })
}
//修改门店状态
export function setShopStatus(data) {
    return request({
        url: 'setShopStatus',
        method: 'post',
        data
    })
}
//##################################################服务项目管理#####################################################
// 服务项目列表
export function getProjectList(data) {
    return request({
        url: 'getProjectList',
        method: 'post',
        data
    })
}
// 添加服务项目
export function addProject(data) {
    return request({
        url: 'addProject',
        method: 'post',
        data
    })
}
//修改服务项目
export function editProject(data) {
    return request({
        url: 'editProject',
        method: 'post',
        data
    })
}
//删除服务项目
export function delProject(data) {
    return request({
        url: 'delProject',
        method: 'post',
        data
    })
}
//修改服务项目状态
export function setProjectStatus(data) {
    return request({
        url: 'setProjectStatus',
        method: 'post',
        data
    })
}
//修改项目分类
export function getProjectClass() {
    return request({
        url: 'getProjectClass',
        method: 'get'
    })
}