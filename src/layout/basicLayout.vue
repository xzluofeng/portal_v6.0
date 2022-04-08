<!--
 * @Author: Jason Liu
 * @Date: 2022-03-18 09:13:47
 * @Desc:
-->
<template>
  <el-container :class="['basic_layout_container']">
    <el-header class="header">
      <div class="winning_loge" @click="goBedCard()">
        <img src="@/assets/images/win-logo.svg" />
      </div>
      <div class="system_name">
        患者360|
        <span v-if="userMessage.jgmc">
          {{
            userMessage.jgmc
              ? userMessage.jgmc
              : userMessage.userMessage.jgmc || ""
          }}
        </span>
      </div>

      <div class="system_user">
        <!-- 换肤 -->
        <el-dropdown class="system_skin" trigger="click">
          <img src="../../src/assets/images/skinColor.svg" />
          <el-dropdown-menu slot="dropdown" class="color-dropdown">
            <el-dropdown-item divided @click.native="changeSkin('winning_60')">
              <span style="display: block">标蓝</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item
              divided
              @click.native="changeSkin('winning_sky_blue')"
            >
              <span style="display: block">天蓝</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item
              divided
              @click.native="changeSkin('winning_cyanogen')"
            >
              <span style="display: block">明青</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item
              divided
              @click.native="changeSkin('winning_pink')"
            >
              <span style="display: block">粉色</span>
            </el-dropdown-item>
            <el-dropdown-item
              divided
              @click.native="changeSkin('winning_purple')"
            >
              <span style="display: block">酱紫</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 头像 -->
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <!-- 用户头像 -->
            <img src="@/assets/images/boy.png" class="user-avatar" />
            <span class="name">{{ userMessage.fullname }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <!-- 下拉显示区域 -->
            <el-dropdown-item divided>
              <span style="display: block">账户管理</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item divided>
              <span style="display: block">操作指南</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item divided>
              <span style="display: block">临时授权申请</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-main>
        <!-- 如果是卡片页面不需要这三个子组件 -->
        <div v-if="$route.path !== '/suffererView'">
          <!-- 第二栏 搜索框 -->
          <UserSearch />
          <!-- 第三栏 患者信息 -->
          <PatientInfo />
          <!-- 第四栏 tabs标签页菜单导航 -->
          <MenusInfo />
        </div>
        <!-- 第六栏 路由切换区域 -->
        <router-view />
        <!-- <router-view /> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import UserSearch from "@/layout/components/userSearch.vue"; // 搜索框组件
import PatientInfo from "@/layout/components/patientInfo.vue"; // 患者信息组件
import MenusInfo from "@/layout/components/menusInfo.vue"; // 标签页导航
import { mapState } from "vuex";
export default {
  name: "layout",
  components: {
    UserSearch,
    PatientInfo,
    MenusInfo,
  },
  data() {
    return {
      // userInfo: {}
    };
  },
  computed: {
    // 获取vuex中的属性
    ...mapState(["userMessage", "infos", "timeLineData"]),
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        // 这两个页面不需要调时间轴
        if (val.path !== "/suffererView") {
          /*
          infos有值的话,就是从卡片页或者搜索页面来的?
          没有的话就是从userMessage拿的参数调时间轴?
          */
          // 获取就诊时间轴数据
          this.initJzjlsjzinfo();
        }
      },
      // 深度观察监听
      deep: true,
      immediate: true,
    },
  },

  mounted() {},

  /**
   * 方法部分
   * **/
  methods: {
    goBedCard() {
      // portalUrl是60门户地址
      const portalUrl = localStorage.getItem("portalurl");
      if (portalUrl && this.$router.history.current.path === "/suffererView") {
        window.open(portalUrl, "_self");
      } else {
        this.$router.push({ path: "/suffererView" });
      }
    },

    // 换肤的功能 刷新页面
    changeSkin(color) {
      this.$storage.set("skinColor", color);
      this.$router.go(0);
    },

    // 获取就诊时间轴数据
    async initJzjlsjzinfo() {
      try {
        // 需要判断参数取自于搜索和点卡片页面vuex会有info做参数存时间轴
        let params = {};
        // 如果是搜索的
        if (this.infos) {
          params = {
            bizRoleId: this.infos.bizRoleId,
            hospitalSoid: this.infos.hospitalSoid,
            pageIndex: "0",
            pageSize: "10",
          };
          const data = await this.$api.getJzjlsjzinfo(params);
          // 存到vuex了，需要用到的页面直接拿
          this.$store.commit("SET_timeLineData", data);
          // 获取患者信息
          this.initPatientInfo();
        } else {
          // 否则来自于sso登录用userMessage做参数存时间轴
          params = {
            bizRoleId: this.userMessage.patid,
            hospitalSoid: this.userMessage.yljgdm,
            pageIndex: "0",
            pageSize: "100",
          };
          const data = await this.$api.getJzjlsjzinfo(params);
          // 存到vuex了，需要用到的页面直接拿
          this.$store.commit("SET_timeLineData", data);
          // 获取患者信息
          this.initPatientInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 获取患者信息  初次渲染时间轴的第一条数据
    async initPatientInfo() {
      try {
        const params = {
          encounterId: this.timeLineData.content[0].encounterId, // 就诊流水号
          hospitalSoid: this.timeLineData.content[0].hospitalSoid, // 医疗机构代码
          encounterTypeNo: this.timeLineData.content[0].encounterTypeNo, // 就诊类别
          pageIndex: "0", // 分页序号(从0开始)
          pageSize: "100", // 页面展示数量
        };
        const data = await this.$api.getPatientByEncounterId(params);
        // this.userInfo = data.content[0];
        this.$store.commit("SET_PatientInfo", data);
      } catch (error) {
        console.log(error);
      }
    },

    // 点击退出登录 重置vuex数据
    logout() {
      this.$store.commit("Logout");
      this.$router.push({ path: "/login" });
    },
  },
};
</script>

<style lang="scss" scoped>
.basic_layout_container {
  .header {
    height: 54px !important;
  }
}
</style>
