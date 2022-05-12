import request from '@/utils/request'

// 获取轮播图列表
export function getBannerList(data) {
    return request({
        url: 'getBannerList',
        method: 'post',
        data
    })
}
// 添加banner
export function addBanner(data) {
    return request({
        url: 'getBannerList',
        method: 'post',
        data
    })
}
// 修改banner
export function editBanner(data) {
    return request({
        url: 'editBanner',
        method: 'post',
        data
    })
}
// 修改banner状态
export function editBannerStatus(data) {
    return request({
        url: 'editBannerStatus',
        method: 'post',
        data
    })
}
//删除banner
export function delBanner(data) {
    return request({
        url: 'delBanner',
        method: 'post',
        data
    })
}