/*
 * @Date: 2022-03-22 16:37:23
 * @LastEditors: OBKoro1
 * @LastEditTime: 2022-04-02 13:40:07
 * @FilePath: \portal_v6.0\public\config\index.js
 */
const config = {
  project: {
    name: "mobile360",
  },
  baseUrl1: "http://127.0.0.1:8762/", // api接口ip地址

  // 开发环境
  baseUrl2: "http://172.16.9.92:8201/", // api接口ip地址
  // 云环境
  // baseUrl2: "http://47.103.152.174:8764/", // api接口ip地址

  casLoginUrl: "http://172.17.1.205:8200/casServer/login", // cas登录地址（根据现场修改ip和端口）
  casCookie: "JSESSIONID-hirc",
};

config.authAdminPath = config.baseUrl1 + "/authAdmin/login"; // 统一权限管理系统登录地址
window.CONFIG = config;
