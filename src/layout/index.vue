<template>
  <!-- 已废弃 -->
  <div class="home-contianer">
    <!-- 第一栏 顶部logo栏 -->
    <div class="navBar">
      <div class="logo">
        <img src="@/assets/images/winning-logo.png" />
        <span>患者360</span>
      </div>
      <div class="logout">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <!-- 用户头像 -->
            <img src="@/assets/images/boy.png" class="user-avatar" />
            <span class="name">{{ userMessage.userName }}</span>
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
    </div>
    <!-- 主体区域大盒子，内容加padding和背景色 -->
    <div class="bodybox">
      <!-- 第二栏 搜索框 -->
      <UserSearch />
      <!-- 第三栏 患者信息 -->
      <PatientInfo :infos.sync="userInfo" />
      <!-- 第四栏 tabs标签页菜单导航 -->
      <MenusInfo />

      <!-- 第六栏 路由切换区域 -->
      <router-view />
    </div>
  </div>
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
      userInfo: {}, // 登录信息
    };
  },
  computed: {
    // 获取vuex中的属性
    ...mapState(["userMessage", "infos"]),
  },
  mounted() {
    // 获取就诊时间轴数据
    this.initJzjlsjzinfo();
    // 获取患者信息
    this.initPatientInfo();
  },

  /**
   * 方法部分
   * **/
  methods: {
    // 获取就诊时间轴数据
    async initJzjlsjzinfo() {
      try {
        const params = {
          bizRoleId: "3000011135",
          hospitalSoid: "0",
          pageIndex: "0",
          pageSize: "100",
        };
        const data = await this.$api.getJzjlsjzinfo(params);
        // 存到vuex了，需要用到的页面直接拿
        this.$store.commit("SET_timeLineData", data);
      } catch (error) {
        console.log(error);
      }
    },
    // 获取患者信息
    async initPatientInfo() {
      try {
        const params = {
          encounterId: "178211002", // 就诊流水号
          hospitalSoid: "0", // 医疗机构代码
          pageIndex: "0", // 分页序号(从0开始)
          pageSize: "2", // 页面展示数量
        };
        const data = await this.$api.getPatientByEncounterId(params);
        this.userInfo = data.content[0];
        console.log(this.userInfo);
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

<style lang='scss' scoped>
.home-contianer {
  min-height: 1000px;
  font-size: 12px;
  background-color: #eef2fd;
  .navBar {
    position: relative;
    width: 100%;
    min-height: 50px;
    background-color: #2d5afb;
    display: flex;
    justify-content: space-between;
    .logo {
      padding-left: 23px;
      img {
        position: relative;
        top: 50%;
        transform: translateY(-55%);
      }
      span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        padding-left: 16px;
        font-size: 19px;
        color: #eaeefe;
      }
    }
    // 右侧头像
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        transform: translateY(50%);
        position: relative;
        // 用户头像
        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 25px;
          vertical-align: middle;
        }
        // 名字
        .name {
          color: #fff;
          cursor: pointer;
          margin-left: 10px;
          font-size: 16px;
          vertical-align: middle;
        }
      }
    }
  }
  .bodybox {
    // height: 1050px; //后续更改
    padding: 10px;
  }
}
</style>
