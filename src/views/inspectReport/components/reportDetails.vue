<template>
  <!-- inspectReport页面的的右下角报告的具体内容页面组件 -->
  <div class="reportDetails-wrap">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="header">
        <span class="title">检查报告</span>
        <span class="buttons">
          <!-- <el-button type="primary" class="button"> 申请开立 </el-button>
          <el-button type="primary" class="button single" plain>
            打印
          </el-button> -->
          <el-button type="primary" class="button single"> 结果对比 </el-button>
          <el-button type="primary" class="button single" plain>
            影像资料
          </el-button>
          <el-button type="primary" class="button single" plain>
            原始报告
          </el-button>
          <el-button type="success" class="button" plain>解读报告</el-button>
        </span>
      </div>
      <!-- 内容区域 -->
      <div class="text item">
        <!-- 头部报告 -->
        <div class="report-title">
          <span class="apply">
            <span class="title">申请时间：</span>
            <span class="content">{{ timeLineContentMsg.cliOrderReqAt }}</span>
          </span>
          <span class="apply">
            <span class="title">就诊科室：</span>
            <span class="content">
              {{
                timeLineContentMsg.deptName ? timeLineContentMsg.deptName : "--"
              }}
            </span>
          </span>
          <span class="apply">
            <span class="title">申请医生：</span>
            <span class="content">
              {{ timeLineContentMsg.cliOrderReqName }}
            </span>
          </span>
          <span class="apply">
            <span class="title">检查时间：</span>
            <span class="content">
              {{ timeLineContentMsg.inspectionAt }}
            </span>
          </span>
          <span class="apply">
            <span class="title">申请病区：</span>
            <span class="content">{{ timeLineContentMsg.wardName }}</span>
          </span>
          <span class="apply">
            <span class="title">报告医生：</span>
            <span class="content">
              {{ timeLineContentMsg.evaluationOperatorName }}
            </span>
          </span>
          <span class="apply">
            <span class="title">发布时间：</span>
            <span class="content">{{ timeLineContentMsg.evaluationAt }}</span>
          </span>
          <span class="apply">
            <span class="title">床位号：</span>
            <span class="content">{{ timeLineContentMsg.bedNo }}</span>
          </span>

          <span class="apply">
            <span class="title">审核医生：</span>
            <span class="content">
              {{ timeLineContentMsg.checkOperatorName }}
            </span>
          </span>
          <span class="apply">
            <span class="title">临床诊断：</span>
            <span class="content">
              {{ timeLineContentMsg.clinicalSummary || "--" }}
            </span>
          </span>
          <span class="apply">
            <span class="title">影像号：</span>
            <span class="content">{{ "--" }}</span>
          </span>
          <span class="apply">
            <span class="title">检查医生：</span>
            <span class="content">
              {{ timeLineContentMsg.inspectionOperatorName }}
            </span>
          </span>
          <span class="apply">
            <span class="title">备注：</span>
            <span class="content">{{ timeLineContentMsg.memo }}</span>
          </span>
          <span class="apply">
            <span class="title">医技号：</span>
            <span class="content">
              {{ timeLineContentMsg.medtechRptId }}
            </span>
          </span>
          <span class="apply">
            <span class="title"></span>
            <span class="content"></span>
          </span>
        </div>
        <!-- 检查部位 -->
        <div class="examinePlace">
          <span class="title">部位</span>
          <p>
            {{
              inspectReportTableList.examPosition
                ? inspectReportTableList.examPosition
                : "--"
            }}
          </p>
        </div>
        <!-- 检查所见 -->
        <div class="examineWatch">
          <span class="title">检查所见</span>
          <p>{{ inspectReportTableList.examFindings }}</p>
        </div>
        <!-- 检查结论 -->
        <div class="examineResults">
          <span class="title">检查结论</span>
          <p>{{ inspectReportTableList.examResult }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    // timeline同级组件通过父组件传过来的数据
    timeLineContentMsg: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 此页面似乎并不需要size,单接口需要此参数
      inspectReportTableList: {},
      currentPage: 0,
      total: 0,
      pageSize: 100,
    };
  },
  watch: {
    timeLineContentMsg: {
      handler(val) {
        // 侦听点击的时间轴内容发现变化 传来的data变化 调接口渲染table
        this.getinspectReportTable();
      },
      // immediate: true,
      deep: true,
    },
  },
  computed: {
    // 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos", "timeLineData", "patientInfo"]),
  },
  mounted() {},
  methods: {
    // 渲染右侧底部的内容
    async getinspectReportTable() {
      try {
        const params = {
          hospitalSoid: this.timeLineData.content[0].hospitalSoid,
          medtechRptId: this.timeLineContentMsg.medtechRptId,
          encounterTypeNo: this.timeLineContentMsg.encounterTypeNo,
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
        };
        const data = await this.$api.getRisReportResult(params);
        this.inspectReportTableList = data.content[0];
        this.total = data.totalElements;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
// @import "~@/styles/variables.scss";
.reportDetails-wrap {
  .box-card {
    width: calc(100% - 55px);
    height: 685px;
    margin-left: 40px;
    font-size: 16px;
    .header {
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      .title {
        &::before {
          content: "";
          border-left: 5px solid #2d5afb;
          margin-right: 8px;
        }
      }
      .buttons {
        .button {
          height: 40px !important;
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
        // align-items: center;
        flex-wrap: wrap;
        width: 100%;
        height: 175px;
      }
      .apply {
        text-align: left;
        flex: 33.3%;
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
    }
    // 部位
    .examinePlace,
    .examineWatch,
    .examineResults {
      text-align: left;
      margin-top: 30px;
      letter-spacing: 1px;
      line-height: 22px;

      .title {
        margin-bottom: 15px;
        display: inline-block;
        &::before {
          content: "";
          border-left: 5px solid #2d5afb;
          margin-right: 8px;
        }
      }
    }
    // 所见
    .examineWatch,
    .examineResults {
      margin-top: 30px;
    }
  }
}
</style>
