<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {
      originalParam: {
        enuserid: "",
        enzjh: "",
        enjzlb: "",
        enpatid: "",
        enjzlsh: "",
        enybkh: "",
        enynkh: "",
        enzyh: "",
        enclientInfo: "",
        enmoduleCode: "",
        enyljgdm: "",
        enyexh: "",
        enksdm: "",
      },
      requestParams: "",
    };
  },
  created() {
    // const sec = this.$route.query;
    // console.log(sec);
    const sec = window.location.search;
    this.initRequestParams(decodeURIComponent(sec), this.originalParam);
  },

  methods: {
    initRequestParams(url, originalParam) {
      var object = {};
      if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        var keyValue = str.split("&");
        for (var i = 0; i < keyValue.length; i++) {
          object[keyValue[i].split("=")[0]] = keyValue[i].split("=")[1];
        }
        for (var key in object) {
          originalParam[key] = object[key];
        }
      }
      // return originalParam;
      this.requestParams = originalParam;
      this.getClientRequest();
    },

    // 存入用户token和userInfo
    getClientRequest() {
      const params = {
        urlParam: JSON.stringify(this.requestParams),
      };

      this.$api
        .getClientRequestUrl(params)
        .then((res) => {
          var infos = res.data.patientInfo;
          var user = res.data.userMessage;
          const userMessage = {
            age: user.age,
            fullname: user.fullname,
            usercode: user.usercode,
            yljgdm: user.jgdm,
            patid: infos.brxxkJz.patid,
            ipAddress: user.ipAddress,
            headPath: user.headPath,
            userId: user.id,
            jgmc: user.jgmc,
            isTopShow: user.isTopShow,
            passwordExpiryDate: user.passwordExpiryDate,
            passwordExpirySwitch: user.passwordExpirySwitch,
            roleType: user.roleType
          };
          /* 存入token */
          this.$store.commit("SET_TOKEN", res.data.token);
          // 医生信息等
          this.$store.commit("USER_MESSAGE", userMessage);

          /* 进行下一次请求，并存入病人信息 */
          /* 设置病人详情信息  infos */
          // var parameter = {
          //   patid: infos.patid,
          //   jzlb: infos.jzlb,
          //   yljgdm: infos.yljgdm,
          //   jzlsh: infos.jzlsh,
          // };
          // 调就诊时间轴，存入vuex
          // this.initJzjlsjzinfo(parameter);

          // 调完sso接口后直接跳到检查页面，创建的时候会调用就诊时间轴和患者信息接口
          this.$router.push({ path: "/inspectReport" });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //  存入点击卡片后的个人信息，和时间轴信息，跳转到首页
    // 获取就诊时间轴数据
    // async initJzjlsjzinfo(parameter) {
    //   try {
    //     const params = {
    //       bizRoleId: parameter.patid,
    //       hospitalSoid: parameter.yljgdm,
    //       pageIndex: "0",
    //       pageSize: "100",
    //     };
    //     const data = await this.$api.getJzjlsjzinfo(params);
    //     // 存到vuex了，需要用到的页面直接拿
    //     this.$store.commit("SET_timeLineData", data);
    //     // 根据就诊时间轴调patientInfo? 存入vuex
    //     this.initPatientInfo(parameter);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // // 获取患者信息
    // async initPatientInfo(parameter) {
    //   try {
    //     const params = {
    //       encounterId: parameter.jzlsh, // 就诊流水号
    //       hospitalSoid: parameter.yljgdm, // 医疗机构代码
    //       encounterTypeNo: parameter.jzlb,
    //       pageIndex: "0", // 分页序号(从0开始)
    //       pageSize: "2", // 页面展示数量
    //     };
    //     const data = await this.$api.getPatientByEncounterId(params);
    //     // this.userInfo = data.content[0];
    //     // 存入vuex持久化
    //     this.$store.commit("SET_Infos", data.content[0]);

    //     // 用户信息调完后跳到首页？
    //     this.$router.push({ path: "/inspectReport" });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  },
};
</script>
