<template>
  <!-- 处方信息页面  -->
  <div class="medicalPerscription-container">
    <!-- 就诊筛选区域 -->
    <OutPatientInfo :baseInfo.sync="treatMentData" />
    <!-- 第一栏 筛选区域 -->
    <div class="filterArea">
      <el-form :inline="true" :model="report" class="moreFilterInfo">
        <!-- 处方类型复选框 -->
        <el-form-item label="处方类型" prop="type">
          <div>
            <el-checkbox
              class="checkAll"
              v-model="checkPersAll"
              @change="handlePersCheckAll"
            >
              全部
            </el-checkbox>
            <el-checkbox-group
              v-model="report.typePerscriptions"
              @change="handlePersChecked"
            >
              <el-checkbox label="药品" name="type"></el-checkbox>
              <el-checkbox label="项目" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <!-- 结算状态复选框 -->
        <el-form-item label="结算状态" prop="type">
          <div>
            <el-checkbox
              class="checkAll"
              v-model="checkSettleAll"
              @change="handleSettleCheckAll"
            >
              全部
            </el-checkbox>
            <el-checkbox-group
              v-model="report.typeSettlement"
              @change="handleSettleChecked"
            >
              <el-checkbox label="已结算" name="type"></el-checkbox>
              <el-checkbox label="未结算" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <!-- 接诊医生 下拉框-->
        <el-form-item label="就诊医生" class="doctorBoxs">
          <el-select
            v-model="report.doctor"
            placeholder="请选择接诊医生"
            class="doctor"
          >
            <el-option label="全部" value="1"></el-option>
            <el-option label="医生1" value="2"></el-option>
            <el-option label="医生2" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- 检索关键词 -->
        <el-form-item label="" class="searchkeys">
          <el-input
            placeholder="请输入处方关键词"
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
        <PerscriptionTimeLine
          :timeLineData.sync="timeLineData"
          @changeTableClickCard="changeTableClickCard"
          :perscriptionInfo.sync="perscriptionInfos"
        />
      </div>
      <div class="report right">
        <PerscriptionInfos
          :perscriptionInfo.sync="perscriptionInfos"
          :currentPage.sync="currentPage"
          :total.sync="total"
          :pageSize.sync="pageSize"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PerscriptionTimeLine from "./components/perscriptionTimeLine.vue";
import PerscriptionInfos from "./components/perscriptionInfos.vue";
import OutPatientInfo from "@/components/outPatientInfo.vue"; // 搜索框组件
import { removeWatermark, setWaterMark } from "@/utils/watermark";
import { mapState } from "vuex";
export default {
  name: "medicalPerscription",
  components: {
    PerscriptionTimeLine,
    PerscriptionInfos,
    OutPatientInfo,
  },
  data() {
    return {
      allPerscriptions: ["药品", "项目"], // 所有处方类型
      allSettlementStatus: ["已结算", "未结算"], // 所有结算状态
      checkPersAll: false, // 处方类型全选
      checkSettleAll: false, // 结算状态全选
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
      report: {
        typePerscriptions: [], // 处方类型 选中的复选框
        typeSettlement: [], // 结算状态 选中的复选框
        doctor: "", // 接诊医生
        keywords: "", // 检索关键词
      },

      // 处方接口的数据渲染表格
      perscriptionInfos: {},
      currentPage: 0,
      total: 0,
      pageSize: 5,
      cardindex: "", // 当前卡片的索引号
    };
  },
  watch: {
    currentPage: {
      handler(val) {
        // 当前页面变化的话重新调接口渲染table
        this.changeTableClickCard(this.cardindex);
      },
      deep: true,
    },
    pageSize: {
      handler(val) {
        // 当前一页数量变化的话重新调接口渲染table
        this.changeTableClickCard(this.cardindex);
      },
      deep: true,
    },

    // 挂载调用可能会出BUG，侦听到timelineData渲染后调用可以解决时间轴渲染顺序BUG
    timeLineData: {
      handler(val) {
        // 当前一页数量变化的话重新调接口渲染table
        this.getperscriptionInfo();
      },
      deep: true,
    },
  },
  computed: {
    // 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos", "timeLineData"]),
  },
  mounted() {
    // 开启水印
    this.initWaterMark();
    // 患者诊断信息接口
    // this.getperscriptionInfo();
  },
  destroyed() {
    // 页面销毁的时候取消水印
    removeWatermark();
  },

  /**
   * 方法部分
   * **/
  methods: {
    // 获取处方信息接口第一条数据 挂载的时候就获取
    async getperscriptionInfo() {
      try {
        const params = {
          csTypeCode: "ZL01",
          encounterId: this.timeLineData.content[0].encounterId, // 就诊流水号
          hospitalSoid: this.timeLineData.content[0].hospitalSoid, // 医疗机构代码
          encounterTypeNo: this.timeLineData.content[0].encounterTypeNo, // 就诊类别
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
        };
        const data = await this.$api.getPrescription(params);

        this.perscriptionInfos = data; // table的
        this.total = data.totalElements;

        // 初始化调用需要拿到第一个的cardindex
        this.cardindex = this.timeLineData.content[0];
      } catch (error) {
        console.log(error);
      }
    },

    // changeTableClickCard 时间轴页传过来的，最后都要给到table页
    async changeTableClickCard(index) {
      // 解决侦听子组件pageSize变化会调第一个table的BUG
      this.cardindex = index;
      // 点击时间轴的事件 子组件传来的事件
      try {
        const params = {
          csTypeCode: "ZL01",
          encounterId: index.encounterId, // 就诊流水号
          hospitalSoid: index.hospitalSoid, // 医疗机构代码
          encounterTypeNo: index.encounterTypeNo, // 就诊类别
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
        };
        const data = await this.$api.getPrescription(params);
        this.perscriptionInfos = data; // table的
        this.total = data.totalElements;
      } catch (error) {
        console.log(error);
      }
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

    // 处方类型的全选
    handlePersCheckAll(val) {
      this.report.typePerscriptions = val ? this.allPerscriptions : [];
    },
    // 处方类型的单选
    handlePersChecked() {
      this.checkPersAll =
        this.allPerscriptions.length === this.report.typePerscriptions.length;
    },
    // 结算状态的全选
    handleSettleCheckAll(val) {
      this.report.typeSettlement = val ? this.allSettlementStatus : [];
    },
    // 结算状态的单选
    handleSettleChecked() {
      this.checkSettleAll =
        this.allSettlementStatus.length === this.report.typeSettlement.length;
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
      this.checkPersAll = false; // 处方类型全选
      this.checkSettleAll = false; // 结算状态全选
      this.report = {
        typePerscriptions: [], // 处方类型 选中的复选框
        typeSettlement: [], // 结算状态 选中的复选框
        doctor: "", // 接诊医生
        keywords: "", // 检索关键词
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.medicalPerscription-container {
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
    // 所有el-form的label标签文字
    ::v-deep.el-form-item__label {
      font-weight: normal;
      color: black;
      font-size: 16px;
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
    .doctorBoxs {
      ::v-deep.el-input--medium {
        width: 210px;
      }
    }
    .searchkeys {
      ::v-deep.el-input--medium {
        width: 430px;
      }
    }
    .isNormal {
      margin-left: 5px;
    }
    .confirmButton {
      margin-left: 8px;
    }
  }
  // 第二栏的左右布局
  .examineContentbox {
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
</style>
