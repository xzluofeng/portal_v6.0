<template>
  <div class="examineReport-container">
    <!-- 检验报告页 -->
    <!-- 就诊筛选区域 -->
    <OutPatientInfo :baseInfo.sync="treatMentData" />
    <!-- 第一栏 筛选区域 -->
    <div class="filterAreas">
      <el-form :inline="true" :model="reports" class="moreFilterInfos">
        <!-- 报告类型 -->
        <el-form-item label="报告类型" prop="type">
          <div>
            <el-checkbox
              class="checkAll"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >
              全部
            </el-checkbox>
            <el-checkbox-group
              v-model="reports.type"
              @change="handleCheckChange"
            >
              <el-checkbox label="生化" name="type"></el-checkbox>
              <el-checkbox label="微生物" name="type"></el-checkbox>
              <el-checkbox label="免疫" name="type"></el-checkbox>
              <el-checkbox label="临检" name="type"></el-checkbox>
              <el-checkbox label="血常规" name="type"></el-checkbox>
              <el-checkbox label="尿常规" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
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
        <!-- 标本 -->
        <el-form-item label="标本">
          <el-select
            v-model="reports.sample"
            placeholder="请选择标本"
            class="sample"
          >
            <el-option label="标本1" value="1"></el-option>
            <el-option label="标本2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- 检索关键词 -->
        <el-form-item label="" class="searchkeys">
          <el-input
            placeholder="请输入检验关键词"
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
        <!-- 只看检索关键词checkbox -->
        <el-form-item class="isNormal">
          <el-checkbox-group v-model="reports.onlySeeIsNormal">
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
    <!-- 第二栏 顶部标签 -->
    <div class="illnesInfoTags">
      <!-- <div class="tag-group">
        <span class="tag-group__title">病情标签：</span>
        <el-tag
          v-for="item in illnesInfos"
          :key="item.index"
          effect="plain"
          :hit="false"
        >
          {{ item }}
        </el-tag>
      </div> -->
    </div>
    <!-- 第三栏 事件时间轴 + 报告 -->
    <div class="examineContentbox">
      <div class="timeline left">
        <ExamineTimeLine
          :timeLineData.sync="timeLineData"
          @timeLineContentClick="timeLineContentClick"
        />
      </div>
      <div class="report right">
        <ExamineReport :timeLineContentMsg="timeLineContentMsg" />
      </div>
    </div>
  </div>
</template>

<script>
import ExamineTimeLine from "./components/examineTimeLine.vue";
import ExamineReport from "./components/examineReport.vue";
import OutPatientInfo from "@/components/outPatientInfo.vue";
import { removeWatermark, setWaterMark } from "@/utils/watermark";
import { mapState } from "vuex";

export default {
  name: "examineReport",
  components: {
    ExamineTimeLine,
    ExamineReport,
    OutPatientInfo,
  },
  data() {
    return {
      allTypes: ["生化", "微生物", "免疫", "临检", "血常规", "尿常规"], // 所有检查类型
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
        type: [], // 报告类型数组类型
        sample: "", // 标本
        doctors: "", // 接诊医生
        keywords: "", // 检索关键词
        onlySeeIsNormal: false, // 检查异常
      },

      // 检验报告的数据
      // timeLineContent: {}, // 其中时间轴可共用的数据
      timeLineContentMsg: {}, // timeline子组件传来的数据 给到报告页渲染
    };
  },
  computed: {
    // 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos", "timeLineData", "patientInfo"]),
  },
  mounted() {
    // 开启水印
    this.initWaterMark();
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
      this.reports.type = val ? this.allTypes : [];
    },
    handleCheckChange() {
      const checkedCount = this.allTypes.length;
      this.checkAll = checkedCount === this.reports.type.length;
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
      this.checkAll = false; // 全选
      this.reports = {
        type: [], // 报告类型数组类型
        sample: "", // 标本
        doctors: "", // 接诊医生
        keywords: "", // 检索关键词
        onlySeeIsNormal: false, // 检查异常
      };
    },
  },
};
</script>

<style scoped lang='scss'>
@import "~@/styles/mixin.scss";
.examineReport-container {
  // 第一栏筛选区域
  .filterAreas {
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
      width: 195px;
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
        width: 320px;
      }
    }
    .isNormal {
      margin-left: 5px;
    }
  }
  // 第二栏 病情标签栏
  .illnesInfoTags {
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
