/*
 * @Date: 2022-03-18 14:21:23
 * @LastEditors: Zhibing Wang
 * @LastEditTime: 2022-04-08 09:18:19
 * @FilePath: \portal_v6.0\src\api\user.js
 */
import { postOld, get } from "../utils/http";

// 封装请求
export default {
  /**
   *端口号8762的老接口
   **/
  getClientRequestUrl(datas) {
    return postOld("c/api/v1/winsso/getClientRequestUrl60", datas);
  },
  getMedicalInstitutionsByUserCode(datas) {
    return postOld("c/dict/getMedicalInstitutionsByUserCode", datas);
  },
  loginCas(datas) {
    return postOld("c/api/v1/token/loginCas", datas);
  },
  loginFromSSO(datas) {
    return postOld("c/api/v1/token/loginFromSSO", datas);
  },
  getDeptInfoByCode(datas) {
    return postOld("c/api/v1/com/getDeptInfoByCode", datas);
  },
  // actions页面用户登录
  login(datas) {
    return postOld("c/api/v1/token/login", datas);
  },
  // login页面用户获取登录机构列表
  getAllInstitutions(datas) {
    return postOld("c/dict/getAllInstitutions", datas);
  },
  // cardview页面获取机构列表
  getAllDepartmentList(datas) {
    return postOld("c/api/v1/com/getDepartment", datas);
  },
  // cardview页面的获取病人信息（参数ksdm & yljgdm)
  getZyjzlistByKsdm(datas) {
    return postOld("c/api/v1/zyjzdjk/getZyjzlistByKsdm", datas);
  },
  // cardView页面获取病人手术信息
  getSsbzByJzlshList(datas) {
    return postOld("c/api/v1/zyjzdjk/getSsbzByJzlshList", datas);
  },
  // cardView页面过敏信息
  getPsjgByJzlshList(datas) {
    return postOld("c/api/v1/zyjzdjk/getPsjgByJzlshList", datas); // 皮试结果（过敏）
  },
  // cardView页面分组信息
  getFzbzByJzlshList(datas) {
    return postOld("c/api/v1/zyjzdjk/getFzbzByJzlshList", datas);
  },
  // cardview页面取消关注
  queryPatient(datas) {
    return postOld("c/api/v1/empi/queryPatient", datas);
  },
  deletePatientGroup(datas) {
    return postOld("c/api/v1/com/deletePatientGroup", datas);
  },
  // cardView页面关注列表渲染
  getEnableUserGroup(datas) {
    return postOld("c/api/v1/com/getEnableUserGroup", datas);
  },
  // cardview页面已关注的人员checkbox的渲染
  getPatientGroup(datas) {
    return postOld("c/api/v1/com/getPatientGroup", datas);
  },
  // cardview页面的弹出框点击确定添加分组事件（更新）
  updatePatidGroup(datas) {
    return postOld("c/api/v1/com/updatePatidGroup", datas);
  },
  // cardview页面切换tabs到我的患者页面调用的接口
  getZyjzlistByUsercode(datas) {
    return postOld("c/api/v1/zyjzdjk/getZyjzlistByUsercode", datas);
  },
  // cardview页面点击卡片获取用户信息
  getPatientByJzlsh(datas) {
    return postOld("c/api/v1/zyjzdjk/getPatientByJzlsh", datas); // 获取病人详情信息  infos
  },

  /**
   * 新接口 端口号8201
   *首页页面相关接口
   **/

  // 就诊时间轴 bizRoleId hospitalSoid pageIndex pageSize
  getJzjlsjzinfo(datas) {
    return get("getJzjlsjzinfo", datas);
  },
  //  获取患者信息 encounterId hospitalSoid pageIndex pageSize
  getPatientByEncounterId(datas) {
    return get("getPatientByEncounterId", datas);
  },

  // 获取患者诊断信息encounterId encounterTypeNo hospitalSoid pageIndex pageSize
  getDiagnosisList(datas) {
    return get("getDiagnosisList", datas);
  },

  // 门诊处方列表
  getPrescriptionList(datas) {
    return get("getPrescription", datas);
  },

  // 患者医嘱列表
  getPatientOrderList(datas) {
    return get("getPatientOrderList", datas);
  },

  // 患者搜索信息/hzxxSearch
  gethzxxSearchList(datas) {
    return get("hzxxSearch", datas);
  },

  // 患者检验报告table /getLisReport
  getLisReportList(datas) {
    return get("getLisReport", datas);
  },

  // 根据报告单号获取检验结果  /getLisReportResult
  getLisReportResultList(datas) {
    return get("getLisReportResult", datas);
  },

  // 获取检查报告列表 /getRisReportList
  getRisReportResultList(datas) {
    return get("getRisReportList", datas);
  },
  // 获取检查结果列表 /getRisReportResultList
  getRisReportResult(datas) {
    return get("getRisReportResultList", datas);
  },
  // 患者卡片
  getZyjzlistByKsdmNew(datas) {
    return get("getZyjzlistByKsdm", datas);
  },

  /**
   * 手术麻醉页面接口
   * **/
  // 手术信息列表  会返回surgExecId
  getSurgeryList(datas) {
    return get("getSurgeryList", datas);
  },
  // 麻醉信息列表 需要surgExecId作为参数
  getAnesthesiaList(datas) {
    return get("getAnesthesiaList", datas);
  },
  // 用药的table接口 需要surgExecId作为参数
  getSurgeryMedicineList(datas) {
    return get("getSurgeryMedicineList", datas);
  },

  /**
   * 体征信息页面接口
   * **/
  // 获取患者体征列表
  getVitalSignList(datas) {
    return get("getVitalSignList", datas);
  },

  /**
   * 获取过敏记录
   * **/
  // 获取患者过敏记录列表
  getAllergyList(datas) {
    return get("getAllergyList", datas);
  },
};
