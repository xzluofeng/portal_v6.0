/*
 * @Date: 2022-03-22 16:37:23
 * @LastEditors: Zhibing Wang
 * @LastEditTime: 2022-04-08 09:18:40
 * @FilePath: \portal_v6.0\src\api\index.js
 */
import user from "./user";
export default {
  login: user.login,
  loginCas: user.loginCas,
  loginFromSSO: user.loginFromSSO,
  getMedicalInstitutionsByUserCode: user.getMedicalInstitutionsByUserCode,
  getZyjzlistByKsdmNew: user.getZyjzlistByKsdmNew,
  getAllInstitutions: user.getAllInstitutions,
  getAllDepartmentList: user.getAllDepartmentList,
  getZyjzlistByKsdm: user.getZyjzlistByKsdm,
  getSsbzByJzlshList: user.getSsbzByJzlshList,
  getPsjgByJzlshList: user.getPsjgByJzlshList,
  getFzbzByJzlshList: user.getFzbzByJzlshList,
  queryPatient: user.queryPatient,
  deletePatientGroup: user.deletePatientGroup,
  getEnableUserGroup: user.getEnableUserGroup,
  getPatientGroup: user.getPatientGroup,
  updatePatidGroup: user.updatePatidGroup,
  getZyjzlistByUsercode: user.getZyjzlistByUsercode,
  getPatientByJzlsh: user.getPatientByJzlsh,
  getPatientByEncounterId: user.getPatientByEncounterId,
  getJzjlsjzinfo: user.getJzjlsjzinfo,
  getClientRequestUrl: user.getClientRequestUrl,
  getDeptInfoByCode: user.getDeptInfoByCode,
  getDiagnosisList: user.getDiagnosisList,
  getPrescription: user.getPrescriptionList,
  getPatientOrderList: user.getPatientOrderList,
  gethzxxSearchList: user.gethzxxSearchList,
  getLisReportList: user.getLisReportList,
  getLisReportResultList: user.getLisReportResultList,
  getRisReportResultList: user.getRisReportResultList,
  getRisReportResult: user.getRisReportResult,
  getSurgeryList: user.getSurgeryList,
  getAnesthesiaList: user.getAnesthesiaList,
  getSurgeryMedicineList: user.getSurgeryMedicineList,
  getVitalSignList: user.getVitalSignList,
  getAllergyList: user.getAllergyList,
};
