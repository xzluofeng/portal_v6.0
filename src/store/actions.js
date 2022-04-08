/*
 * @Date: 2022-03-22 16:37:24
 * @LastEditors: OBKoro1
 * @LastEditTime: 2022-03-24 15:56:07
 * @FilePath: \portal_v6.0\src\store\actions.js
 */
import API from "../api/index";
// actions中调登录接口拿到token
const actions = {
  getToken(context, data) {
    // 每次登录先清空上一次的token
    context.commit("remove_Token");
    // 再调接口拿到新的token
    return new Promise((resolve, reject) => {
      API.login(data)
        .then((res) => {
          /* 存入用户信息 */
          // const userMessage = {
          //   userName: res.data.fullname,
          //   yljgdm: res.data.jgdm,
          //   headPath: res.data.headPath,
          //   usercode: res.data.usercode,
          //   userId: res.data.id,
          //   isTopShow: res.data.isTopShow,
          //   passwordExpiryDate: res.data.passwordExpiryDate,
          //   passwordExpirySwitch: res.data.passwordExpirySwitch,
          //   roleType: res.data.roleType,
          // };
          // 存入token
          context.commit("SET_TOKEN", " " + res.data.token);
          // sso直接存入的是res.data,这里后期可能也需要存入多点数据
          // context.commit("USER_MESSAGE", userMessage);
          context.commit("USER_MESSAGE", res.data);

          resolve();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
};

export default actions;
