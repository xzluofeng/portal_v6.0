<template>
  <div></div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {
      originalParam: {
        ptflag: '',
        appid: '',
        userid: '',
        loginid: '',
        captcha: '',
        loginflag: '',
        extendparam: '',
      },
    };
  },
  created() {
    const sec = window.location.search;
    this.initRequestParams(decodeURIComponent(sec), this.originalParam);

    // var cas_filter_switch = wued.getBaseConfigByKey('cas_filter_switch');
    // 跳单点登录页面
    window.location.href = window.CONFIG.casLoginUrl + "?service=" + encodeURI(window.CONFIG.baseUrl1 + "hirccas")
  },

  methods: {
    getTrim(obj) {
      return obj.replace(/(^\s*)|(\s*$)/g, "");
    },
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
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
      var nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
      localStorage.setItem('nowTime', nowTime);
      sessionStorage.setItem('sso_in_param', JSON.stringify(originalParam));
    }
  },
};
</script>
