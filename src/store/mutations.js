/*
 * @Date: 2022-03-22 16:37:24
 * @LastEditors: OBKoro1
 * @LastEditTime: 2022-03-24 17:07:29
 * @FilePath: \portal_v6.0\src\store\mutations.js
 */
import Vue from "vue";
import state from "./state";

const Mutations = {
  // 保存token
  SET_TOKEN(state, data) {
    state.token = data;
  },
  // 删除token，将vuex中token置空
  remove_Token(state) {
    state.token = null;
  },
  // 保存用户信息
  USER_MESSAGE(state, data) {
    state.userMessage = data;
  },
  // 退出登录 重置数据
  Logout(state, data) {
    state.token = "";
    state.userMessage = "";
    state.originalPatids = "";
    state.infos = "";
    state.timeLineData = {};
  },
  /**
   * 卡片页面做跳转到home页面需要用的2个参数
   * patid/  bizRoleId
   * jslsh/  hospitalSoid
   * **/

  SET_Infos(state, data) {
    state.infos = data;
  },

  /**
   * 时间轴的数据在layout页面调取的
   * **/
  SET_timeLineData(state, data) {
    state.timeLineData = data;
  },
  /**
   * 根据时间轴的第一条数据在layout页面调取的
   * 渲染页面顶部个人信息的数据，有些页面需要该参数作为接口
   * **/
  SET_PatientInfo(state, data) {
    state.patientInfo = data;
  },
};

export default Mutations;
