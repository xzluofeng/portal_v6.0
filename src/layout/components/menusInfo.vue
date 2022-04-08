<!--
 * @Date: 2022-03-22 16:37:24
 * @LastEditors: OBKoro1
 * @LastEditTime: 2022-04-01 14:59:03
 * @FilePath: \portal_v6.0\src\layout\components\menusInfo.vue
-->
<template>
  <div class="menusInfo-wrap">
    <el-tabs
      v-model="activeName"
      class="tabs"
      type="card"
      @tab-click="handleClick"
    >
      <!-- <el-tab-pane label="首页" name="home"></el-tab-pane> -->
      <el-tab-pane label="检查报告" name="inspectReport"></el-tab-pane>
      <el-tab-pane label="检验报告" name="examineReport"></el-tab-pane>
      <el-tab-pane label="处方信息" name="medicalPerscription"></el-tab-pane>
      <el-tab-pane label="医嘱信息" name="doctorOrder"></el-tab-pane>
      <el-tab-pane label="诊断信息" name="diagnosisInfo"></el-tab-pane>
      <el-tab-pane label="体征信息" name="physicalSigns"></el-tab-pane>
      <el-tab-pane label="病历信息" name="medicalRecord"></el-tab-pane>
      <!-- <el-tab-pane label="病案首页" name="diseaseCase"></el-tab-pane> -->
      <el-tab-pane label="手麻信息" name="surgicalAnesthesia"></el-tab-pane>
      <el-tab-pane label="护理病历" name="nurseHistory"></el-tab-pane>
      <el-tab-pane label="过敏记录" name="allergyRecord"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "inspectReport",
    };
  },
  watch: {
    // 侦听路由的变化，如路由为检查页面，那么activeName为初始化状态
    $route: {
      handler: function (val, oldVal) {
        if (val.path === "/inspectReport") {
          this.activeName = "inspectReport";
        }
      },
      // 深度观察监听
      deep: true,
      // immediate: true,
    },
  },
  mounted() {
    // 页面挂载 时候初始化的路由页面
    this.$router.push("inspectReport");
  },
  methods: {
    handleClick(tab, event) {
      this.$router.push(`/${tab.name}`);
      // sessionStorage.setItem("path", tab.name);
    },
  },
};
</script>

<style lang='scss' scoped>
.menusInfo-wrap {
  width: 100%;
  height: 50px;
  margin-top: 10px;
  background-color: #ffffff;

  .tabs {
    ::v-deep.el-tabs__item {
      height: 49px;
      line-height: 49px;
      font-size: 16px;
    }
  }
}
</style>
