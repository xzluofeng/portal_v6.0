<!--
 * @Date: 2022-03-28 16:35:03
 * @LastEditors: Zhibing Wang
 * @LastEditTime: 2022-04-06 15:52:15
 * @FilePath: \portal_v6.0\src\views\surgicalAnesthesia\components\surgicalAnesthesiaReport.vue
-->
<template>
  <div class="surgicalAnesthesia-wrap">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="header titles">
        <div>
          <span class="time">{{ titleInfo.visitStartTime }}</span>
          <span class="content">
            {{
              titleInfo.viewDiagnosisPrincipal
                ? titleInfo.viewDiagnosisPrincipal[0].diagnosisName
                : "--"
            }}
          </span>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="text item">
        <!-- 信息栏1 -->
        <!-- <div slot="header" class="header contents">
          <span class="title">患者信息</span>
        </div>
        <div class="report-title">
          <span class="apply">
            <span class="title">姓名：</span>
            <span class="content">
              {{ timeLineContentMsg.infos.name }}
            </span>
          </span>
          <span class="apply">
            <span class="title">性别：</span>
            <span class="content">{{ timeLineContentMsg.infos.sex }}</span>
          </span>
          <span class="apply">
            <span class="title">出生日期：</span>
            <span class="content">{{ timeLineContentMsg.infos.birth }}</span>
          </span>
          <span class="apply">
            <span class="title">证件号：</span>
            <span class="content">{{ timeLineContentMsg.infos.idCard }}</span>
          </span>
          <span class="apply">
            <span class="title">住院号：</span>
            <span class="content">{{ "-" }}</span>
          </span>
        </div> -->
        <!-- 第二个信息栏 -->
        <div slot="header" class="header contents">
          <span class="title">手术信息</span>
        </div>
        <div class="report-title">
          <span class="apply">
            <span class="title">开始时间：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.startTime }}
            </span>
          </span>
          <span class="apply">
            <span class="title">结束时间：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.endTime }}
            </span>
          </span>
          <span class="apply">
            <span class="title">主刀医生：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.mainDoctor }}
            </span>
          </span>
          <span class="apply">
            <span class="title">手术科室：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.department }}
            </span>
          </span>
          <span class="apply">
            <span class="title">手术一助：</span>
            <span class="content">{{ "-" }}</span>
          </span>
          <span class="apply">
            <span class="title">手术二助：</span>
            <span class="content"> {{ "-" }} </span>
          </span>
          <span class="apply">
            <span class="title">器械护士：</span>
            <span class="content">{{ "-" }}</span>
          </span>
          <span class="apply">
            <span class="title">巡回护士：</span>
            <span class="content">{{
              timeLineContentMsg.operationInfo.nurse
            }}</span>
          </span>

          <span class="apply">
            <span class="title">手术名称：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.operationName }}
            </span>
          </span>
          <span class="apply">
            <span class="title">手术等级：</span>
            <span class="content">{{
              timeLineContentMsg.operationInfo.surgicalLevel
            }}</span>
          </span>
          <span class="apply">
            <span class="title">手术体位：</span>
            <span class="content">{{ "--" }}</span>
          </span>
          <span class="apply">
            <span class="title">手术部位：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.location }}
            </span>
          </span>
          <span class="apply">
            <span class="title">术前诊断：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.beforeDiagnose }}
            </span>
          </span>
          <span class="apply">
            <span class="title">术后诊断：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.afterDiagnose }}
            </span>
          </span>
          <span class="apply">
            <span class="title">术后出向：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.leave }}
            </span>
          </span>
          <span class="apply">
            <span class="title">介入物：</span>
            <span class="content">
              {{ timeLineContentMsg.operationInfo.inject }}
            </span>
          </span>
        </div>
        <!-- 第三行信息栏 -->
        <div slot="header" class="header contents">
          <span class="title">麻醉信息</span>
        </div>
        <div class="report-title">
          <span class="apply">
            <span class="title">开始时间：</span>
            <span class="content">
              {{ timeLineContentMsg.anesthesia.startTime }}
            </span>
          </span>
          <span class="apply">
            <span class="title">结束时间：</span>
            <span class="content">
              {{ timeLineContentMsg.anesthesia.endTime }}
            </span>
          </span>
          <span class="apply">
            <span class="title">麻醉医生：</span>
            <span class="content">
              {{ timeLineContentMsg.anesthesia.doctor }}
            </span>
          </span>
          <span class="apply">
            <span class="title">麻醉名称：</span>
            <span class="content">
              {{ timeLineContentMsg.anesthesia.name }}
            </span>
          </span>
          <span class="apply">
            <span class="title">麻醉一助：</span>
            <span class="content">
              {{ timeLineContentMsg.anesthesia.mainHelper }}
            </span>
          </span>
          <span class="apply">
            <span class="title">麻醉二助：</span>
            <span class="content">
              {{ timeLineContentMsg.anesthesia.secondHelper }}
            </span>
          </span>
          <span class="apply">
            <span class="title">ASA分级：</span>
            <span class="content">
              {{ timeLineContentMsg.anesthesia.ASA }}
            </span>
          </span>
          <span class="apply">
            <span class="title">麻醉体位：</span>
            <span class="content">
              {{ timeLineContentMsg.anesthesia.bodyLocation }}
            </span>
          </span>
        </div>
        <!-- 第四行检验结果表格 -->
        <div slot="header" class="header t1">
          <span class="title">输血信息</span>
        </div>
        <el-table
          :data="timeLineContentMsg.bloodTable"
          border
          style="width: 100%; border: 1px solid #ccc"
          :header-cell-style="{
            background: '#ebeeff',
            color: '#606266',
            borderColor: '#ccc',
          }"
          :cell-style="{ borderColor: '#ccc' }"
        >
          <el-table-column
            prop="labtestIndexName"
            label="时间"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="labtestResultUnit"
            label="名称"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="labtestRefValue"
            label="用量"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="labtestRefValue"
            label="单位"
            min-width="120"
            align="center"
          >
          </el-table-column>
        </el-table>
        <!-- el-分页器1 -->
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage1 + 1"
          :page-sizes="[5, 20, 100, 500]"
          :page-size="pageSize1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1"
        />

        <!-- 第五行用药信息表格 -->
        <div slot="header" class="header t2">
          <span class="title">用药信息</span>
        </div>
        <el-table
          :data="timeLineContentMsg.dragTable"
          border
          style="width: 100%; border: 1px solid #ccc"
          :header-cell-style="{
            background: '#ebeeff',
            color: '#606266',
            borderColor: '#ccc',
          }"
          :cell-style="{ borderColor: '#ccc' }"
        >
          <el-table-column
            prop="labtestIndexName"
            label="用药名称"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="labtestResultUnit"
            label="每次用量"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="labtestRefValue"
            label="用量单位"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="labtestRefValue"
            label="数量"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="labtestRefValue"
            label="数量单位"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="labtestRefValue"
            label="用药开始时间"
            :show-overflow-tooltip="true"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="labtestRefValue"
            label="用药结束时间"
            :show-overflow-tooltip="true"
            min-width="120"
            align="center"
          >
          </el-table-column>
        </el-table>
        <!-- el-分页器2 -->
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage2 + 1"
          :page-sizes="[5, 20, 100, 500]"
          :page-size="pageSize2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total2"
        />

        <!-- 第六行操作事件表格 -->
        <div slot="header" class="header t3">
          <span class="title">手麻操作事件</span>
        </div>
        <el-table
          :data="timeLineContentMsg.handleTable"
          border
          style="width: 100%; border: 1px solid #ccc"
          :header-cell-style="{
            background: '#ebeeff',
            color: '#606266',
            borderColor: '#ccc',
          }"
          :cell-style="{ borderColor: '#ccc' }"
        >
          <el-table-column
            prop="order"
            label="序号"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="time"
            label="时间"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="handle"
            label="操作事件"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table>
        <!-- el-分页器3 -->
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage3 + 1"
          :page-sizes="[5, 20, 100, 500]"
          :page-size="pageSize3"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total3"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    // timeline同级组件通过父组件传过来的数据
    singleTimeLineInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 模拟数据
      timeLineContentMsg: {
        infos: {
          name: "吴五妹",
          sex: "女",
          birth: "1965-09-24",
          idCard: "440622196509243663",
        },
        operationInfo: {
          startTime: "2022-03-23",
          endTime: "2022-03-24",
          mainDoctor: "蔡敏",
          department: "五官科",
          nurse: "王曼尼",
          operationName: "耳廓假性囊肿手术",
          surgicalLevel: "1",
          location: "耳朵",
          beforeDiagnose: "耳廓假性囊肿",
          afterDiagnose: "耳廓假性囊肿",
          leave: "回病区",
          inject: "无",
        },
        anesthesia: {
          startTime: "2022-03-23",
          endTime: "2022-03-24",
          doctor: "蔡敏",
          name: "全身麻醉",
          mainHelper: "张绍强",
          secondHelper: "何智宏",
          ASA: "||",
          bodyLocation: " 俯卧位 ",
        },
        bloodTable: [],
        dragTable: [],
        handleTable: [
          { order: "1", time: "2022-03-24 10:10:12", handle: "入手术室" },
          { order: "2", time: "2022-03-24 11:10:02", handle: "开放上肢静脉" },
          { order: "3", time: "2022-03-24 12:10:12", handle: "麻醉开始" },
          { order: "4", time: "2022-03-24 12:30:32", handle: "手术开始" },
          {
            order: "5",
            time: "2022-03-24 12:50:42",
            handle: "切除耳廓假性囊肿",
          },
        ],
      },

      // report页面头部信息
      titleInfo: {},
      // 手术信息
      surgeryList: {},
      // 麻醉信息
      anesthesiaList: {},
      // 用药信息table
      medicalList: [],

      // 分页器1
      currentPage1: 0,
      total1: 0,
      pageSize1: 5,
      // 分页器2 用药tabel
      currentPage2: 0,
      total2: 0,
      pageSize2: 5,
      // 分页器3
      currentPage3: 0,
      total3: 5,
      pageSize3: 5,
    };
  },

  watch: {
    // 挂载调用可能会出BUG，侦听到timelineData渲染后调用可以解决时间轴渲染顺序BUG
    timeLineData: {
      handler(val) {
        // 初始渲染report页面的title
        this.titleInfo = val.content[0];
        // 1. 手术信息(初始化第一条)
        this.getFirstSurgeryListInfo();
      },
      deep: true,
    },
    singleTimeLineInfo: {
      handler(val) {
        console.log(val, "val");
        this.titleInfo = val;
        // 1. 手术信息(侦听到的时间轴点击后的任意条)
        this.getSurgeryListInfo(val);
      },
      deep: true,
    },
  },

  computed: {
    // 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos", "timeLineData", "patientInfo"]),
  },
  mounted() {},

  methods: {
    // 1.手术信息 先拿到时间轴第一条数据作参数渲染右侧手术信息
    async getFirstSurgeryListInfo() {
      try {
        const params = {
          encounterId: this.timeLineData.content[0].encounterId, // 就诊流水号
          hospitalSoid: this.timeLineData.content[0].hospitalSoid, // 医疗机构代码
          encounterTypeNo: this.timeLineData.content[0].encounterTypeNo, // 就诊类别
          pageIndex: "0",
          pageSize: "100",
        };
        const data = await this.$api.getSurgeryList(params);
        this.surgeryList = data.content[0];

        // 2. 根据手术信息的参数 手术执行记录标识 调麻醉信息
        this.getAnesthesiaList(data.content[0].surgExecId);

        // 3. 调用药table的数据
        this.getSurgeryMedicineList(data.content[0].surgExecId);
      } catch (error) {
        console.log(error);
      }
    },

    // 麻醉信息
    async getAnesthesiaList(surgExecId) {
      try {
        const params = {
          surgExecId: surgExecId, // 手术执行记录标识
          hospitalSoid: this.timeLineData.content[0].hospitalSoid, // 医疗机构代码
          pageIndex: "0",
          pageSize: "100",
        };
        const data = await this.$api.getAnesthesiaList(params);
        this.anesthesiaList = data.content[0];
      } catch (error) {
        console.log(error);
      }
    },

    // 用药table
    async getSurgeryMedicineList(surgExecId) {
      try {
        const params = {
          surgExecId: surgExecId, // 手术执行记录标识
          hospitalSoid: this.timeLineData.content[0].hospitalSoid, // 医疗机构代码
          pageIndex: this.currentPage2,
          pageSize: this.pageSize2,
        };
        const data = await this.$api.getSurgeryMedicineList(params);
        this.medicalList = data;
      } catch (error) {
        console.log(error);
      }
    },

    // 1.侦听到时间轴变化后，调用不同的手术信息接口
    async getSurgeryListInfo(index) {
      try {
        const params = {
          encounterId: index.encounterId, // 就诊流水号
          hospitalSoid: index.hospitalSoid, // 医疗机构代码
          encounterTypeNo: index.encounterTypeNo, // 就诊类别
          pageIndex: "0",
          pageSize: "100",
        };
        const data = await this.$api.getSurgeryList(params);
        this.SurgeryList = data.content[0];

        // 2. 根据手术信息的参数 手术执行记录标识 调麻醉信息
        this.getAnesthesiaList(data.content[0].surgExecId);

        // 3. 调用药table的数据
        this.getSurgeryMedicineList(data.content[0].surgExecId);
      } catch (error) {
        console.log(error);
      }
    },

    // 处理分页器的两个事件
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // this.getexamineTable();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val - 1;
      // this.getexamineTable();
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.surgicalAnesthesia-wrap {
  .box-card {
    width: calc(100% - 55px);
    height: 685px;
    margin-left: 40px;
    font-size: 16px;
    .titles {
      font-size: 18px;
    }
    .header {
      height: 55px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      .time {
        margin-right: 20px;
      }
      .title {
        &::before {
          content: "";
          border-left: 5px solid #2d5afb;
          margin-right: 8px;
        }
      }
    }
    // 内容区域
    .item {
      height: 530px;
      overflow-y: auto;
      @include scrollBar;
      margin-bottom: 18px;
      // 头部报告
      .report-title {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        width: 100%;
        // height: 175px;
      }

      .apply {
        text-align: left;
        flex: 25%;
        margin: 8px 0px;
        .title {
          color: #919191;
          display: inline-block;
          width: 100px;
          text-align: right;
        }
        .content {
          color: #3d3d3d;
        }
      }
      .el-table {
        cursor: pointer;
        margin-bottom: 10px;
        font-size: 16px !important;
      }
      .pagination {
        margin-bottom: 30px;
      }
    }
  }
}
</style>
