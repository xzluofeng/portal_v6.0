<template>
  <!-- 体征信息页面 -->
  <div class="physicalSigns-container">
    <!-- 就诊筛选区域 -->
    <OutPatientInfo :baseInfo.sync="treatMentData" />
    <!-- 第一栏 筛选区域 -->
    <div class="filterArea">
      <el-form :inline="true" :model="reports" class="moreFilterInfo">
        <!-- 接诊医生 下拉框-->
        <el-form-item label="接诊医生" class="doctorBox">
          <el-select
            v-model="reports.doctor"
            placeholder="请选择接诊医生"
            class="doctor"
          >
            <el-option label="全部" value="1"></el-option>
            <el-option label="医生1" value="2"></el-option>
            <el-option label="医生2" value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- 提交重置按钮 -->
        <el-form-item class="confirmButton">
          <el-button type="primary" @click="submitForm" class="button">
            查询
          </el-button>
          <el-button @click="resetForm" class="button">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 第二栏 事件时间轴 + 处方信息 -->
    <div class="examineContentbox">
      <div class="timeline left">
        <PhysicalSignsTimeLine
          :timeLineData.sync="timeLineData"
          @changeTableClickCard="changeTableClickCard"
        />
      </div>
      <div class="report right">
        <PhysicalSignsInfos :singleTimeLineInfo="singleTimeLineInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import PhysicalSignsTimeLine from "./components/physicalSignsTimeLine.vue";
import PhysicalSignsInfos from "./components/physicalSignsInfos.vue";
import OutPatientInfo from "@/components/outPatientInfo.vue"; // 搜索框组件
import { removeWatermark, setWaterMark } from "@/utils/watermark";
import { mapState } from "vuex";
export default {
  name: "physicalSigns",
  components: {
    PhysicalSignsTimeLine,
    PhysicalSignsInfos,
    OutPatientInfo,
  },
  data() {
    return {
      // 传给子组件渲染就诊数据的（通过.sync双向绑定了）
      treatMentData: {
        date: [
          this.$moment(new Date()).format("YYYY-MM-DD"),
          this.$moment(new Date()).add(1, "day").format("YYYY-MM-DD"),
        ], // 就诊日期
        institution: "", // 就诊机构
        department: "", // 就诊科室
        type: "", // 就诊类型
      },
      // 头部报告的所有数据
      reports: {
        doctor: "", // 接诊医生下拉框
      },

      // 子组件时间轴传过来的，点击的某条时间轴数据
      singleTimeLineInfo: {},
    };
  },

  watch: {
    // 挂载调用可能会出BUG，侦听到timelineData渲染后调用可以解决时间轴渲染顺序BUG
    timeLineData: {
      handler(val) {
        // 当前一页数量变化的话重新调接口渲染table
        // this.getDiagnosisListInfo();
      },
      deep: true,
    },
  },

  computed: {
    /// 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos", "timeLineData"]),
  },

  mounted() {
    // 开启水印
    this.initWaterMark();
    // 患者诊断信息接口
    // this.getDiagnosisListInfo();
  },

  destroyed() {
    // 页面销毁的时候取消水印
    removeWatermark();
  },

  methods: {
    // 时间轴页传过来的 点击不同的时间轴
    changeTableClickCard(index) {
      // 再传给report子组件取侦听
      this.singleTimeLineInfo = index;
    },

    // 开启水印的方法
    initWaterMark() {
      setWaterMark(
        this.userMessage.fullname +
          " " +
          this.userMessage.usercode +
          " " +
          this.userMessage.ipAddress,
        ""
      );
    },

    // 点击 请输入关键词检索的图标
    handleSearchIconsClick(e) {
      console.log(e);
    },
    // 提交重置按钮
    // 提交数据
    submitForm() {},
    // 重置数据
    resetForm() {
      this.treatMentData = {
        date: [
          this.$moment(new Date()).format("YYYY-MM-DD"),
          this.$moment(new Date()).add(1, "day").format("YYYY-MM-DD"),
        ], // 就诊日期
        institution: "", // 就诊机构
        department: "", // 就诊科室
        type: "", // 就诊类型
      };
      this.reports = {
        doctor: "", // 接诊医生下拉框
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.physicalSigns-container {
  // 第一栏筛选区域
  .filterArea {
    white-space: nowrap; //超出强制不换行
    overflow: hidden; // 超出隐藏处理
    width: 100%;
    height: 70px;
    display: flex;
    padding: 15px 20px 0px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    .moreFilterInfo {
      // 所有el-form的label标签文字
      ::v-deep.el-form-item__label {
        font-weight: normal;
        color: black;
        font-size: 16px;
      }
      ::v-deep.el-input--medium {
        width: 360px;
      }
      .f2,
      .confirmButton {
        margin-left: 8px;
      }
    }
  }
  // 第二栏的左右布局
  .examineContentbox {
    padding-top: 20px;
    width: 100%;
    // height: 700px;
    background-color: #fff;
    display: flex;
    .timeline {
      // background-color: pink;
      width: 550px;
      overflow-y: auto;
      @include scrollBar;
      height: 700px;
    }
    .report {
      background-color: #fff;
      width: calc(100% - 550px);
      height: 700px;
    }
  }
}
</style>
