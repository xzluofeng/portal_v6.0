/*
 * @Date: 2022-03-22 16:37:24
 * @LastEditors: OBKoro1
 * @LastEditTime: 2022-03-24 17:07:27
 * @FilePath: \portal_v6.0\src\store\state.js
 */
const state = {
  token: "", // 请求头配置中的token，登录时获取
  userMessage: "", // 用户信息
  /**
   * cardView页面做跳转到home页面需要用的2参数
   * **/

  infos: "", //  cardView页面的保存用户信息

  /**
   * 时间轴的数据在layout页面调取的
   * **/
  timeLineData: {},
  /**
   * 根据时间轴的第一条数据在layout页面调取的
   * 渲染页面顶部个人信息的数据，有些页面需要该参数作为接口
   * **/
  patientInfo: {},

  /**
   * 搜索用户，点击某行存入的某行数据
   * **/
};

export default state;
