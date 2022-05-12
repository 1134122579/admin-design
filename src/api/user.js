import request from '@/utils/request'

export function login(data) {
    const _data = { 'user': data['username'], 'pass': data['password'] }
    console.log(_data)
    return request({
        url: 'login',
        method: 'post',
        data: _data

    })
}

export function getInfo(token) {
    return request({
        url: '/vue-element-admin/user/info',
        method: 'get',
        params: { token }
    })
}
// 获取用户信息列表
export function userList(data) {
    return request({
        url: 'userList',
        method: 'post',
        data
    })
}
// 修改用户状态
export function setUserStatus(data) {
    return request({
        url: 'setUserStatus',
        method: 'post',
        data
    })
}
// 修改用户信息
export function editUser(data) {
    return request({
        url: 'editUser',
        method: 'post',
        data
    })
}
export function logout() {
    return { success: true, info: '退出成功', data: { code: 201 } }
    // return request({
    //   url: '/logout',
    //   method: 'post'
    // })
}