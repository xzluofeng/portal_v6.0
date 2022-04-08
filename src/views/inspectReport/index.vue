<template>
  <div class="inspectReport-container">
    <!-- 检查报告页 -->
    <!-- 就诊筛选区域 -->
    <OutPatientInfo :baseInfo.sync="treatMentData" />
    <div class="filterArea">
      <el-form :inline="true" :model="report" class="moreFilterInfo">
        <!-- 报告类型 -->
        <el-form-item label="报告类型" prop="type">
          <div>
            <el-checkbox
              class="checkAll"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="report.type"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox label="胃镜" name="type"></el-checkbox>
              <el-checkbox label="黑白超" name="type"></el-checkbox>
              <el-checkbox label="彩超" name="type"></el-checkbox>
              <el-checkbox label="普放" name="type"></el-checkbox>
              <el-checkbox label="心电图" name="type"></el-checkbox>
              <el-checkbox label="CT" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <!-- 接诊医生 -->
        <el-form-item label="接诊医生">
          <el-select
            v-model="report.doctor"
            placeholder="请选择接诊医生"
            class="doctor"
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
            v-model="report.keywords"
          >
            <i
              class="el-icon-search"
              slot="suffix"
              @click="handleSearchIconClick"
            />
          </el-input>
        </el-form-item>
        <!-- 只看检索关键词checkbox -->
        <el-form-item class="isNormal">
          <el-checkbox-group v-model="report.onlySeeIsNormal">
            <el-checkbox label="只看异常"></el-checkbox>
          </el-checkbox-group>
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
    <!-- 第二栏 顶部标签 先隐藏-->
    <div class="illnessStateTags">
      <!-- <div class="tag-group">
        <span class="tag-group__title">病情标签：</span>
        <el-tag
          v-for="item in illTags"
          :key="item.index"
          effect="plain"
          :hit="false"
        >
          {{ item }}
        </el-tag>
      </div> -->
    </div>
    <!-- 第三栏 事件时间轴 + 报告 -->
    <div class="contentbox">
      <div class="timeline left">
        <TimeLine
          :timeLineData.sync="timeLineData"
          @timeLineContentClick="timeLineContentClick"
        />
      </div>
      <div class="report right">
        <ReportDetails :timeLineContentMsg="timeLineContentMsg" />
      </div>
    </div>
  </div>
</template>

<script>
import TimeLine from "./components/timeLine.vue";
import ReportDetails from "./components/reportDetails.vue";
import OutPatientInfo from "@/components/outPatientInfo.vue"; // 搜索框组件
import { removeWatermark, setWaterMark } from "@/utils/watermark";
import { mapState } from "vuex";
const types = ["胃镜", "黑白超", "彩超", "普放", "心电图", "CT"];
export default {
  name: "inspectReport",
  components: {
    TimeLine,
    ReportDetails,
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
      report: {
        type: [], // 报告类型数组类型
        doctor: "", // 接诊医生
        keywords: "", // 检索关键词
        onlySeeIsNormal: false, // 检查异常
      },
      allTypes: types, // 所有检查类型

      // 检查报告的数据
      // totimeLineContent: {}, // 其中时间轴可共用的数据
      timeLineContentMsg: {}, // timeline子组件点击某条数据传来的数据 给到报告页渲染
    };
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
    // 获取检查报告列表
    // this.getinspectReportInfos()
  },
  destroyed() {
    // 页面销毁的时候取消水印
    removeWatermark();
  },

  methods: {
    // 时间轴子组件点击后传过来的item项数据 给报告子组件调table
    timeLineContentClick(data) {
      this.timeLineContentMsg = data;
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

    // 小选全选
    handleCheckAllChange(val) {
      console.log(val);
      this.report.type = val ? this.allTypes : [];
    },
    handleCheckedCitiesChange() {
      const checkedCount = this.allTypes.length;
      this.checkAll = checkedCount === this.report.type.length;
    },
    // 点击 请输入关键词检索的图标
    handleSearchIconClick(e) {
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
      this.checkAll = false;
      this.report = {
        type: [], // 报告类型数组类型
        doctor: "", // 接诊医生
        keywords: "", // 检索关键词
        onlySeeIsNormal: false, // 检查异常
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.inspectReport-container {
  // 第一栏筛选区域
  .filterArea {
    white-space: nowrap; //超出强制不换行
    overflow: hidden; // 超出隐藏处理
    width: 100%;
    height: 65px;
    display: flex;
    padding-top: 15px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    ::v-deep.el-form-item__label {
      font-weight: normal;
      color: black;
      font-size: 16px;
    }
    ::v-deep.el-input--medium {
      width: 225px;
    }
    // 复选框
    ::v-deep.el-checkbox__label {
      padding-left: 5px;
      font-size: 16px;
    }
    ::v-deep.el-checkbox__input {
      width: 19px;
      height: 19px;
    }
    ::v-deep.el-checkbox-group {
      display: inline;
    }
    ::v-deep.el-checkbox {
      margin-right: 13px;
    }

    .searchkeys {
      ::v-deep.el-input--medium {
        width: 445px;
      }
    }
    .isNormal {
      margin-left: 5px;
    }
  }
  // 第二栏 病情标签栏
  .illnessStateTags {
    padding-left: 20px;
    padding-top: 12px;
    // min-height: 50px;
    min-height: 20px;
    background-color: #fff;
    font-weight: normal;
    color: black;
    font-size: 16px;
    ::v-deep.tag-group {
      text-align: left;
    }
  }
  // 第三栏的左右布局
  .contentbox {
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
