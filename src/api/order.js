import request from '@/utils/request'

// 获取证书订单列表
export function getCertOrderList(data) {
    return request({
        url: 'getCertOrderList',
        method: 'post',
        data
    })
}
// 备注证书订单
export function setcertOrderRemark(data) {
    return request({
        url: 'setcertOrderRemark',
        method: 'post',
        data
    })
}

// 证书订单退款
export function return_cert_order(data) {
    return request({
        url: 'return_cert_order',
        method: 'post',
        data
    })
}
// 修改证书订单信息
export function edit_cert_order(data) {
    return request({
        url: 'edit_cert_order',
        method: 'post',
        data
    })
}
// 获取赛事订单订单列表
export function getMatchOrderList(data) {
    return request({
        url: 'getMatchOrderList',
        method: 'post',
        data
    })
}
// 备注赛事订单
export function setMatchOrderRemark(data) {
    return request({
        url: 'setMatchOrderRemark',
        method: 'post',
        data
    })
}
// 证书订单退款
export function return_match_order(data) {
    return request({
        url: 'return_match_order',
        method: 'post',
        data
    })
}