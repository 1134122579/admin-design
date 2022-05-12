/*
 * @Author: your name
 * @Date: 2021-09-03 22:34:13
 * @LastEditTime: 2021-09-04 09:37:39
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \navadmin\src\api\seting.js
 */
import request from '@/utils/request'
// 添加用户
export function addAdminUser(data) {
    return request({
        url: '/add_user',
        method: 'post',
        data
    })
}
// 修改用户密码
export function editUserPass(data) {
    return request({
        url: '/edit_user_pass',
        method: 'post',
        data
    })
}
