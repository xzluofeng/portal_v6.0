<template>
  <!-- 病历信息页面 -->
  <div class="medicalRecord-container">
    <!-- 就诊筛选区域 -->
    <OutPatientInfo :baseInfo.sync="treatMentData" />
    <!-- 第一栏 筛选区域 -->
    <div class="filterArea">
      <el-form :inline="true" :model="reports" class="moreFilterInfomations">
        <!-- 接诊医生 下拉框-->
        <el-form-item label="接诊医生" class="reciveDoctor">
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
        <!-- 检索关键词 -->
        <el-form-item label="" class="searchkey">
          <el-input
            placeholder="请输入病例关键词"
            clearable
            v-model="reports.keywords"
          >
            <i
              class="el-icon-search"
              slot="suffix"
              @click="handleSearchClick"
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
    <!-- 第二栏 事件时间轴 + 病历信息 -->
    <div class="medicalRecordbox">
      <div class="timeline left">
        <NurseHistoryTimeLine @returnSrc="returnSrc"/>
      </div>
      <div class="report right">
        <NurseHistoryInfos :pdf-src="pdfSrc"/>
      </div>
    </div>
  </div>
</template>

<script>
import NurseHistoryTimeLine from "./components/nurseHistoryTimeLine.vue";
import NurseHistoryInfos from "./components/nurseHistoryInfos.vue";
import OutPatientInfo from "@/components/outPatientInfo.vue"; // 搜索框组件
import { removeWatermark, setWaterMark } from "@/utils/watermark";
import { mapState } from "vuex";
export default {
  name: "nurseHistory",
  components: {
    NurseHistoryTimeLine,
    NurseHistoryInfos,
    OutPatientInfo,
  },
  data() {
    return {
      pdfSrc: '',
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
        keywords: "", // 检索关键词
      },
    };
  },
  computed: {
    // 获取vuex中的属性
    ...mapState(["userMessage", "infos"]),
  },
  mounted() {
    // 开启水印
    setWaterMark(
      this.userMessage.fullname +
        " " +
        this.userMessage.usercode +
        " " +
        this.userMessage.ipAddress,
      ""
    );
  },
  destroyed() {
    // 页面销毁的时候取消水印
    removeWatermark();
  },

  /**
   * 方法部分
   * **/
  methods: {
    returnSrc(data) {
      this.pdfSrc = data;
    },
    // 点击 请输入关键词检索的图标
    handleSearchClick(e) {
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
        keywords: "", // 检索关键词
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.medicalRecord-container {
  // 第一栏筛选区域
  .filterArea {
    white-space: nowrap; //超出强制不换行
    overflow: hidden; // 超出隐藏处理
    width: 100%;
    height: 65px;
    display: flex;
    padding: 15px 20px 0px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    .moreFilterInfomations {
      // 所有el-form的label标签文字
      ::v-deep.el-form-item__label {
        font-weight: normal;
        color: black;
        font-size: 16px;
      }
      .reciveDoctor {
        ::v-deep.el-input--medium {
          width: 360px;
        }
      }
      .searchkey {
        margin-left: 8px;
        ::v-deep.el-input--medium {
          width: 435px;
        }
      }
      .confirmButton {
        margin-left: 8px;
      }
    }
  }
  // 第二栏的左右布局
  .medicalRecordbox {
    padding-top: 20px;
    width: 100%;
    background-color: #fff;
    display: flex;
    .timeline {
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
</style>>
