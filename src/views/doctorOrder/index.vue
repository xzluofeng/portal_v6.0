<template>
  <!-- 医嘱信息页面 -->
  <div class="doctorOrder-container">
    <!-- 就诊筛选区域 -->
    <OutPatientInfo :baseInfo.sync="treatMentData" />
    <!-- 第一栏 筛选区域 -->
    <div class="filterArea">
      <el-form :inline="true" :model="reports" class="moreFilterInfo">
        <!-- 医嘱类别复选框 -->
        <el-form-item label="医嘱类别" prop="type">
          <div>
            <el-checkbox
              class="checkAll"
              v-model="checkOrdersAll"
              @change="doctorOrderCheckAll"
            >
              全部
            </el-checkbox>
            <el-checkbox-group
              v-model="reports.doctorOrders"
              @change="doctorOrderChecked"
            >
              <el-checkbox label="长期医嘱" name="type"></el-checkbox>
              <el-checkbox label="临时医嘱" name="type"></el-checkbox>
              <el-checkbox label="有效医嘱" name="type"></el-checkbox>
              <el-checkbox label="停止医嘱" name="type"></el-checkbox>
              <el-checkbox label="取消医嘱" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
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
        <!-- 无label的9个复选框 -->
        <div class="nonameCheckbox">
          <el-form-item label="" prop="type">
            <el-checkbox
              class="checkAll"
              v-model="checkNoNameCheckBoxAll"
              @change="noNameCheckAll"
            >
              全部
            </el-checkbox>
            <el-checkbox-group
              v-model="reports.noNameCheckBox"
              @change="noNameChecked"
            >
              <el-checkbox label="药品" name="type"></el-checkbox>
              <el-checkbox label="检查" name="type"></el-checkbox>
              <el-checkbox label="检验" name="type"></el-checkbox>
              <el-checkbox label="手术" name="type"></el-checkbox>
              <el-checkbox label="治疗" name="type"></el-checkbox>
              <el-checkbox label="护理" name="type"></el-checkbox>
              <el-checkbox label="膳食" name="type"></el-checkbox>
              <el-checkbox label="其它" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 检索关键词 -->
          <el-form-item label="" class="searchkeys">
            <el-input
              placeholder="请输入医嘱关键词"
              clearable
              v-model="reports.keywords"
            >
              <i
                class="el-icon-search"
                slot="suffix"
                @click="handleSearchIconsClick"
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
        </div>
      </el-form>
    </div>
    <!-- 第二栏 事件时间轴 + 处方信息 -->
    <div class="examineContentbox">
      <div class="timeline left">
        <DoctorOrderTimeLine
          :timeLineData.sync="timeLineData"
          @changeTableClickCard="changeTableClickCard"
          :doctorOrderInfos.sync="doctorOrderInfos"
        />
      </div>
      <div class="report right">
        <DoctorOrderInfos
          :doctorOrderInfos.sync="doctorOrderInfos"
          :currentPage.sync="currentPage"
          :total.sync="total"
          :pageSize.sync="pageSize"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DoctorOrderTimeLine from "./components/doctorOrderTimeLine.vue";
import DoctorOrderInfos from "./components/doctorOrderInfos.vue";
import OutPatientInfo from "@/components/outPatientInfo.vue"; // 搜索框组件
import { removeWatermark, setWaterMark } from "@/utils/watermark";
import { mapState } from "vuex";
export default {
  name: "doctorOrder",
  components: {
    DoctorOrderTimeLine,
    DoctorOrderInfos,
    OutPatientInfo,
  },
  data() {
    return {
      checkOrdersAll: false, // 医嘱类型全选
      checkNoNameCheckBoxAll: false, // 第二排没label标签的复选框 全选
      allDoctorOrders: [
        "长期医嘱",
        "临时医嘱",
        "有效医嘱",
        "停止医嘱",
        "取消医嘱",
      ], // 所有处方类型
      allNoName: [
        "药品",
        "检查",
        "检验",
        "手术",
        "治疗",
        "护理",
        "膳食",
        "其它",
      ],
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
        doctorOrders: [], // 医嘱类型 选中的复选框
        doctor: "", // 接诊医生下拉框
        noNameCheckBox: [], // 第二排没label标签的复选框
        keywords: "", // 检索关键词
      },

      // 医嘱接口的数据渲染表格
      doctorOrderInfos: {},
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
        this.initPatientOrderInfo();
      },
      deep: true,
    },
  },

  computed: {
    // 获取vuex中的属性
    ...mapState(["userMessage", "infos", "timeLineData"]),
  },

  mounted() {
    // 开启水印
    this.initWaterMark();
    // 处方信息接口
    // this.initPatientOrderInfo();
  },

  destroyed() {
    // 页面销毁的时候取消水印
    removeWatermark();
  },

  /**
   * 方法部分
   * **/
  methods: {
    // 获取处方信息接口 按时间轴的第一条数据先渲染
    async initPatientOrderInfo() {
      try {
        const params = {
          encounterId: this.timeLineData.content[0].encounterId, // 就诊流水号
          hospitalSoid: this.timeLineData.content[0].hospitalSoid, // 医疗机构代码
          encounterTypeNo: this.timeLineData.content[0].encounterTypeNo, // 就诊类别
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
        };
        const data = await this.$api.getPatientOrderList(params);

        this.doctorOrderInfos = data;
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
      try {
        const params = {
          csTypeCode: "ZL01",
          encounterId: index.encounterId, // 就诊流水号
          hospitalSoid: index.hospitalSoid, // 医疗机构代码
          encounterTypeNo: index.encounterTypeNo, // 就诊类别
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
        };
        const data = await this.$api.getPatientOrderList(params);
        this.doctorOrderInfos = data;
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

    // 医嘱类型的全选事件
    doctorOrderCheckAll(val) {
      this.reports.doctorOrders = val ? this.allDoctorOrders : [];
    },
    // 医嘱类型的单选事件
    doctorOrderChecked() {
      this.checkOrdersAll =
        this.allDoctorOrders.length === this.reports.doctorOrders.length;
    },
    // 第二排没label标签的复选框 全选事件
    noNameCheckAll(val) {
      this.reports.noNameCheckBox = val ? this.allNoName : [];
    },
    // 第二排没label标签的复选框 单选事件
    noNameChecked() {
      this.checkNoNameCheckBoxAll =
        this.allNoName.length === this.reports.noNameCheckBox.length;
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
      this.checkOrdersAll = false; // 医嘱类型全选
      this.checkNoNameCheckBoxAll = false; // 第二排没label标签的复选框 全选
      this.reports = {
        doctorOrders: [], // 医嘱类型 选中的复选框
        doctor: "", // 接诊医生下拉框
        noNameCheckBox: [], // 第二排没label标签的复选框
        keywords: "", // 检索关键词
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.doctorOrder-container {
  // 第一栏筛选区域
  .filterArea {
    white-space: nowrap; //超出强制不换行
    overflow: hidden; // 超出隐藏处理
    width: 100%;
    height: 120px;
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
      ::v-deep.el-form-item {
        margin-bottom: 10px;
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
      .doctorBox {
        margin-left: 248px;
        ::v-deep.el-input--medium {
          width: 360px;
        }
      }
      .nonameCheckbox {
        display: block;
        display: flex;
      }
      .searchkeys {
        ::v-deep.el-input--medium {
          width: 475px;
        }
      }
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
