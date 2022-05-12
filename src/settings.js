/*
 * @Author: your name
 * @Date: 2021-09-03 22:34:14
 * @LastEditTime: 2021-09-03 23:25:33
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \navadmin\src\settings.js
 */
module.exports = {
  title: "天空之橙视频号管理后台",

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: "production",
};
