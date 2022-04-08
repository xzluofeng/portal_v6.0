<template>
  <!-- examineReport页面的的右下角报告的具体内容页面组件 -->
  <div class="examineReport-wrap">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="header">
        <span class="title">检验报告</span>
        <span class="buttons">
          <!-- <el-button type="primary" class="button"> 申请开立 </el-button>
          <el-button type="primary" class="button single" plain>
            打印
          </el-button> -->
          <el-button type="primary" class="button single"> 影像资料 </el-button>
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
            <span class="content">
              {{ timeLineContentMsg.cliOrderReqAt }}
            </span>
          </span>
          <span class="apply">
            <span class="title">标本类型：</span>
            <span class="content">{{ timeLineContentMsg.speciText }}</span>
          </span>
          <span class="apply">
            <span class="title">申请医生：</span>
            <span class="content">
              {{ timeLineContentMsg.cliOrderReqName }}
            </span>
          </span>
          <span class="apply">
            <span class="title">采样时间：</span>
            <span class="content">
              {{ timeLineContentMsg.checkOperatorAt }}
            </span>
          </span>
          <span class="apply">
            <span class="title">标本说明：</span>
            <span class="content">{{ "-" }}</span>
          </span>
          <span class="apply">
            <span class="title">报告医生：</span>
            <span class="content">
              {{ timeLineContentMsg.evaluationOperatorName }}
            </span>
          </span>
          <span class="apply">
            <span class="title">送检时间：</span>
            <span class="content">{{ timeLineContentMsg.inspectionAt }}</span>
          </span>
          <span class="apply">
            <span class="title">就诊科室：</span>
            <span class="content">{{ timeLineContentMsg.deptName }}</span>
          </span>

          <span class="apply">
            <span class="title">审核医生：</span>
            <span class="content">
              {{ timeLineContentMsg.checkOperatorName }}
            </span>
          </span>
          <span class="apply">
            <span class="title">发布时间：</span>
            <span class="content">{{ timeLineContentMsg.evaluationAt }}</span>
          </span>
          <span class="apply">
            <span class="title">申请病区：</span>
            <span class="content">{{ timeLineContentMsg.wardName }}</span>
          </span>
          <span class="apply">
            <span class="title">标本号：</span>
            <span class="content">{{ timeLineContentMsg.speciNo }}</span>
          </span>
          <span class="apply">
            <span class="title">临床诊断：</span>
            <span class="content">
              {{ timeLineContentMsg.clinicalSummary }}
            </span>
          </span>
          <span class="apply">
            <span class="title">床位号：</span>
            <span class="content">{{ timeLineContentMsg.bedNo }}</span>
          </span>
          <span class="apply">
            <span class="title">试管条码：</span>
            <span class="content">{{ "-" }}</span>
          </span>
          <span class="apply">
            <span class="title">备注：</span>
            <span class="content">{{ timeLineContentMsg.memo }}</span>
          </span>
        </div>
        <!-- 检验结果表格 -->
        <el-table
          :data="examineTableList"
          border
          tooltip-effect="dark"
          max-height="31vh"
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
            label="项目名称"
            min-width="290"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="结果" min-width="150" align="center">
            <template slot-scope="scope">
              <div class="flex">
                <span class="left">
                  <span class="number">{{ scope.row.labtestResult }}</span>
                  <span :class="[scope.row.isUp]"></span>
                </span>
                <span class="right trend" @click="handleTrend(scope.row)">
                  查看趋势
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="labtestResultUnit"
            label="单位"
            min-width="70"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="labtestRefValue"
            label="参考值"
            min-width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" min-width="150" align="center">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                >收藏</el-button
              >
              <el-button type="text" size="small">指南</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- el-分页器 -->
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage + 1"
          :page-sizes="[5, 20, 100, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
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
      // 掉接口获取的table数据
      examineTableList: [],
      currentPage: 0,
      total: 0,
      pageSize: 5,
      // 全局用的hospitalSoid
      hospitalSoid: "",
    };
  },
  watch: {
    timeLineContentMsg: {
      handler(val) {
        // 这个hospitalId给到全局
        this.hospitalSoid = val.hospitalSoid;
        // 侦听点击的时间轴内容发现变化 传来的data变化 调接口渲染table
        this.getexamineTable(val);
      },
      // immediate: true,
      deep: true,
    },
  },
  mounted() {},

  methods: {
    // 渲染右侧tabel
    async getexamineTable(val) {
      // 还缺一个hospitalId
      try {
        const params = {
          hospitalSoid: this.hospitalSoid,
          medtechRptId: this.timeLineContentMsg.medtechRptId,
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
        };
        const data = await this.$api.getLisReportResultList(params);
        this.examineTableList = data.content;
        this.total = data.totalElements;
        // 计算指标正常与否
        this.judgementHealth();
      } catch (error) {
        console.log(error);
      }
    },

    // // 处理分页器的两个事件
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getexamineTable();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val - 1;
      this.getexamineTable();
    },

    // 判断项目结果是否过高
    judgementHealth() {
      for (let i = 0; i < this.examineTableList.length; i++) {
        const arr = this.examineTableList[i].labtestRefValue
          .replace(/\r/g, "")
          .split("～");
        if (this.examineTableList[i].labtestResult * 1 > arr[1] * 1) {
          this.$set(this.examineTableList[i], "isUp", "high");
        } else if (this.examineTableList[i].labtestResult < arr[0] * 1) {
          this.$set(this.examineTableList[i], "isUp", "low");
        } else {
          this.$set(this.examineTableList[i], "isUp", "normal");
        }
      }
    },
    // 点击查看趋势
    handleTrend(row) {
      console.log(row);
    },
    // 点击收藏
    handleClick(row) {
      console.log(row);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.examineReport-wrap {
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

      // 设置table max-height后table右侧滚动条消失BUG
      /deep/.el-table__body-wrapper {
        max-height: calc(31vh - 48px);
      }
      .el-table {
        cursor: pointer;
        margin-top: 10px;
        font-size: 16px !important;
        .cell {
          .el-button--text {
            font-size: 16px;
          }
        }
        .flex {
          display: flex;
          justify-content: space-around;
          // todo...三种样式
          .high {
            color: red;
            vertical-align: middle;
            &::after {
              content: "↑";
              font-size: 18px;
              padding-left: 8px;
            }
          }
          .low {
            color: orange;
            vertical-align: middle;
            &::after {
              content: "↓";
              font-size: 18px;
              padding-left: 8px;
            }
          }
          .trend {
            color: #409eff;
            border-bottom: 1px solid #409eff;
          }
        }
      }
    }
  }
}
</style>
