<template>
  <div class="surgicalAnesthesia-container">
    <!-- 手麻信息 -->
    <!-- 就诊筛选区域 -->
    <OutPatientInfo :baseInfo.sync="treatMentData" />
    <!-- 第一栏 筛选区域 -->
    <div class="filterAreas">
      <el-form :inline="true" :model="reports" class="moreFilterInfos">
        <!-- 接诊医生 -->
        <el-form-item label="接诊医生">
          <el-select
            v-model="reports.doctors"
            placeholder="请选择接诊医生"
            class="doctors"
          >
            <el-option label="医生1" value="1"></el-option>
            <el-option label="医生2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- 检索关键词 -->
        <el-form-item label="" class="searchkeys">
          <el-input
            placeholder="请输入检查关键词"
            clearable
            v-model="reports.keywords"
          >
            <i
              class="el-icon-search"
              slot="suffix"
              @click="handleSearchIconClick"
            />
          </el-input>
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

    <!-- 第三栏 事件时间轴 + 报告 -->
    <div class="examineContentbox">
      <div class="timeline left">
        <SurgicalAnesthesiaTimeLine
          :timeLineData.sync="timeLineData"
          @changeTableClickCard="changeTableClickCard"
        />
      </div>
      <div class="report right">
        <SurgicalAnesthesiaReport :singleTimeLineInfo="singleTimeLineInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import SurgicalAnesthesiaTimeLine from "./components/surgicalAnesthesiaTimeLine.vue";
import SurgicalAnesthesiaReport from "./components/surgicalAnesthesiaReport.vue";
import OutPatientInfo from "@/components/outPatientInfo.vue";
import { removeWatermark, setWaterMark } from "@/utils/watermark";
import { mapState } from "vuex";

export default {
  name: "surgicalAnesthesia",
  components: {
    SurgicalAnesthesiaTimeLine,
    SurgicalAnesthesiaReport,
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

      // 头部报告数据
      checkAll: false, // 全选
      reports: {
        doctors: "", // 接诊医生
        keywords: "", // 检索关键词
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
    // 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos", "timeLineData", "patientInfo"]),
  },
  mounted() {
    // 开启水印
    this.initWaterMark();
    /**
     * 真实逻辑是要根据时间轴的第一条数据查出右侧的内容
     * **/
    // 患者患者检验报告接口
    // this.getexamineReportInfos()
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
    handleSearchIconClick(e) {
      console.log(e);
    },
    // 提交重置按钮
    // 提交数据
    submitForm() {},
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
        doctors: "", // 接诊医生
        keywords: "", // 检索关键词
      };
    },
  },
};
</script>

<style scoped lang='scss'>
@import "~@/styles/mixin.scss";
.surgicalAnesthesia-container {
  // 第一栏筛选区域
  .filterAreas {
    white-space: nowrap; //超出强制不换行
    overflow: hidden; // 超出隐藏处理
    width: 100%;
    height: 65px;
    display: flex;
    padding: 15px 20px 15px 20px;
    margin-bottom: 20px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    ::v-deep.el-form-item__label {
      font-weight: normal;
      color: black;
      font-size: 16px;
    }
    ::v-deep.el-input--medium {
      width: 363px;
    }
    .searchkeys {
      margin-left: 10px;
      ::v-deep.el-input--medium {
        width: 430px;
      }
    }
    .confirmButton {
      margin-left: 10px;
    }
  }
  // 第三栏的左右布局
  .examineContentbox {
    width: 100%;
    height: 700px;
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
