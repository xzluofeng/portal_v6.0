<template>
  <div></div>
</template>
<script>
import { Message } from "element-ui";
import { Base64 } from "js-base64";

export default {
  data() {
    return {
      originalParam: {

      },
      params: {},
    };
  },
  created() {
    const sec = window.location.search;
    this.initRequestParams(decodeURIComponent(sec), this.originalParam);
    console.log(this.params[window.CONFIG.casCookie]);
    if (this.params[window.CONFIG.casCookie]) {
      this.setCookie(window.CONFIG.casCookie, this.params[window.CONFIG.casCookie], 0);
      if (this.params.user) {
        var username = this.params.user;
        var yljgdm = '0002';
        var password = 'abc123';

        this.$api
          .getMedicalInstitutionsByUserCode({
            userCode: username
          })
          .then((res) => {
            if (res.data && res.data.length > 0) {
              yljgdm = res.data[0].code;
              this.$api
                .loginCas({
                  usercode: Base64.encode(username),
                  yljgdm: Base64.encode(yljgdm)
                })
                .then((data) => {
                  // 如果是管理员跳转到统一后台管理系统
                  if (data.data.isAdmin === 1) {
                    window.location.href = encodeURI(window.CONFIG.authAdminPath + '?account=' + Base64.btoa(username) + '&password=' + Base64.btoa(password) + '&hosptailId=' + Base64.btoa(yljgdm) + '&productId=' + Base64.btoa('01'))
                  } else {
                    this.$store.commit("SET_TOKEN", data.data.token);
                    this.$storage.set("username", username);

                    var userMessage = {
                      ipAddress: data.data.ipAddress,
                      fullname: data.data.fullname,
                      yljgdm: data.data.jgdm,
                      jgmc: data.data.jgmc,
                      headPath: data.data.headPath,
                      usercode: data.data.usercode,
                      userId: data.data.id,
                      isTopShow: data.data.isTopShow,
                      passwordExpiryDate: '2099-12-30 00:00:00.000',
                      passwordExpirySwitch: data.data.passwordExpirySwitch
                    };
                    this.$store.commit("USER_MESSAGE", userMessage);
                    localStorage.setItem('roleType', data.data.roleType);
                    this.$router.push({ path: "/suffererView" });
                  }
                });
            } else {
              Message.error('360系统没有该用户！');
            }
          });
      }
    }
  },

  methods: {
    setCookie(name, value, day) {
      // 当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
      if (day !== 0) {
        var expires = day * 24 * 60 * 60 * 1000;
        var date = new Date(+new Date() + expires);
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
      } else {
        document.cookie = name + "=" + escape(value);
      }
    },
    getTrim(obj) {
      return obj.replace(/(^\s*)|(\s*$)/g, "");
    },
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        // var c = ca[i].trim();
        var c = this.getTrim(ca[i]);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
      }
      return "";
    },
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
      this.params = originalParam;
    }
  },
};
</script>
