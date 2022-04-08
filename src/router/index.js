import Vue from "vue";
import VueRouter from "vue-router";
// 引入vuex判断权限
import store from "@/store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  // 床位卡页面的路由
  // {
  //   path: '/cardView',
  //   name: 'cardView',
  //   meta: { title: '卡片' },
  //   component: () =>
  //     import('@/views/cardView/index.vue')
  // },
  // 登录页面的路由
  {
    path: "/login",
    name: "login",
    meta: { title: "登录页" },
    component: () => import("@/views/login/newIndex.vue"),
  },
  {
    path: "/getClientRequestUrl.html",
    name: "ssoRedirect",
    meta: {
      title: "业务系统单点登录",
    },
    component: () => import("@/views/ssoRedirect/index.vue"),
  },
  {
    path: "/loginHirc.html",
    name: "loginHirc",
    meta: {
      title: "单点登录跳转",
    },
    component: () => import("@/views/ssoRedirect/loginHirc.vue"),
  },
  {
    path: "/redirectCas.html",
    name: "redirectCas",
    meta: {
      title: "单点登录-床位卡",
    },
    component: () => import("@/views/ssoRedirect/redirectCas.vue"),
  },
  {
    path: "/loginSso.html",
    name: "loginSso",
    meta: {
      title: "单点登录-床位卡",
    },
    component: () => import("@/views/ssoRedirect/loginSso.vue"),
  },
  /**
   * 下面为菜单栏的路由页面
   * 默认子路由写法
   * **/
  {
    /**
     * @Author: Jason Liu
     * @description: 这是主应用模板，前面的页面要是需要用模板的话，可以放在这个下面
     */
    path: "/suffererView",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        // 患者视图
        path: "",
        name: "suffererView",
        meta: { title: "患者视图" },
        component: (resolve) => require(["@/views/suffererView"], resolve),
      },
    ],
  },
  // 主题预览
  {
    path: "/themepreview",
    name: "themepreview",
    component: () => import("@/themes/view-ele.vue"),
    meta: { title: "主题预览" },
  },

  // 患者首页的路由(暂时隐藏掉)
  // {
  //   path: "/home",
  //   component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
  //   children: [
  //     {
  //       path: "",
  //       name: "home",
  //       component: () => import("@/views/home/index"),
  //       meta: { title: "首页" },
  //     },
  //   ],
  // },
  // 检查报告的路由
  {
    path: "/inspectReport",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "", // 不写路径 默认为父路径
        name: "inspectReport",
        component: () => import("@/views/inspectReport/index"),
        meta: { title: "检查报告" },
      },
    ],
  },
  // 检验报告的路由
  {
    path: "/examineReport",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "examineReport",
        component: () => import("@/views/examineReport/index"),
        meta: { title: "检验报告" },
      },
    ],
  },
  // 处方信息
  {
    path: "/medicalPerscription",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "medicalPerscription",
        component: () => import("@/views/medicalPerscription/index"),
        meta: { title: "处方信息" },
      },
    ],
  },
  // 医嘱信息的路由
  {
    path: "/doctorOrder",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "doctorOrder",
        component: () => import("@/views/doctorOrder/index"),
        meta: { title: "医嘱信息" },
      },
    ],
  },

  // 诊断信息的路由
  {
    path: "/diagnosisInfo",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "diagnosisInfo",
        component: () => import("@/views/diagnosisInfo/index"),
        meta: { title: "诊断信息" },
      },
    ],
  },

  {
    path: "/physicalSigns",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "physicalSigns",
        component: () => import("@/views/physicalSigns/index"),
        meta: { title: "体征信息" },
      },
    ],
  },
  // 病历信息的路由
  {
    path: "/medicalRecord",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "medicalRecord",
        component: () => import("@/views/medicalRecord/index"),
        meta: { title: "病历信息" },
      },
    ],
  },
  // 病案首页
  // {
  //   path: "/diseaseCase",
  //   component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
  //   children: [
  //     {
  //       path: "",
  //       name: "diseaseCase",
  //       component: () => import("@/views/diseaseCase/index"),
  //       meta: { title: "病案首页" },
  //     },
  //   ],
  // },
  // 手术麻醉
  {
    path: "/surgicalAnesthesia",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "surgicalAnesthesia",
        component: () => import("@/views/surgicalAnesthesia/index"),
        meta: { title: "手麻信息" },
      },
    ],
  },
  // 护理病历
  {
    path: "/nurseHistory",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "nurseHistory",
        component: () => import("@/views/nurseHistory/index"),
        meta: { title: "护理病历" },
      },
    ],
  },
  // 过敏记录
  {
    path: "/allergyRecord",
    component: (resolve) => require(["@/layout/basicLayout.vue"], resolve),
    children: [
      {
        path: "",
        name: "allergyRecord",
        component: () => import("@/views/allergyRecord/index"),
        meta: { title: "过敏记录" },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL, // 基路径 没设置默认为/
  routes,
});

// 消除路由重复点击bug
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};

// 路由前置守卫做路由权限判断
/**
 * 注释掉了，做演示用，不判断token
 * **/
// router.beforeEach((to, from, next) => {
//   // 点击登录后，开始存在token了 ， 路由回退到login页面也能打印出store.state.token了
//   if ((store.state.token === '' || store.state.token === " undefined") && to.fullPath !== '/login') {
//     // 如果没有token，而且去的页面不是login页面，那么就强制到登录页
//     if (to.query.userMessage && to.query.userMessage !== '') {
//       // (兼容处理？在没有token的情况下根据路由参数来判断)
//       next({ name: 'cardView', params: { param: JSON.stringify(to.query) } })
//     } else {
//       next({ path: '/login' })
//     }
//   } else {
//     // 否则的话就直接放行，执行登录页里面的this.$route.push('/')
//     console.log(store.state.token);
//     next()
//   }
// })

export default router;
