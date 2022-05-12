import request from '@/utils/request'

// 获取猫咪列表
export function getCarList(data) {
    return request({
        url: 'getCatList',
        method: 'post',
        data
    })
}
//删除猫咪信息
export function delCat(data) {
    return request({
        url: 'delCat',
        method: 'post',
        data
    })
}
// 设置猫咪状态
export function setCatStatus(data) {
    return request({
        url: 'setCatStatus',
        method: 'post',
        data
    })
}
// 获取猫咪分类
export function getCatClass(data) {
    return request({
        url: 'getCatClass',
        method: 'post',
        data
    })
}
// 设置猫咪分类状态
export function setCatClassStatus(data) {
    return request({
        url: 'setCatClassStatus',
        method: 'post',
        data
    })
}
// 添加猫咪分类
export function addCatClass(data) {
    return request({
        url: 'addCatClass',
        method: 'post',
        data
    })
}
// 修改猫咪分类信息
export function editCatClass(data) {
    return request({
        url: 'editCatClass',
        method: 'post',
        data
    })
}
// 首字母
export function getTopClass() {
    return request({
        url: 'getTopClass',
        method: 'get',
    })
}