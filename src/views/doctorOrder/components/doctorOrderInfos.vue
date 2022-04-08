<template>
  <!-- doctorOrder页面的的右下角报告的具体内容页面组件 -->
  <div class="doctorOrder-wrap">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="header">
        <span class="title">医嘱信息</span>
        <span class="buttons">
          <!-- <el-button type="primary" class="button"> 引用医嘱 </el-button> -->
        </span>
      </div>
      <!-- 内容区域 -->
      <div class="text item">
        <el-table
          :data="doctorOrderInfos.content"
          border
          tooltip-effect="dark"
          max-height="51vh"
          style="width: 100%; border: 1px solid #ccc"
          :header-cell-style="{
            background: '#ebeeff',
            color: '#606266',
            borderColor: '#ccc',
          }"
          :cell-style="{ borderColor: '#ccc' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" min-width="40" align="center" />
          <el-table-column
            label="开立时间"
            min-width="120"
            header-align="left"
            align="left"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.prescribedAt }}
            </template>
          </el-table-column>
          <el-table-column
            label="医嘱内容"
            min-width="110"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.cliOrderItemContent }}
            </template>
          </el-table-column>
          <el-table-column label="类型" min-width="50" align="center">
            <template slot-scope="scope">
              {{ scope.row.orderPeriodName || "临时" }}
            </template>
          </el-table-column>
          <el-table-column label="停止者" min-width="70" align="center">
            <template slot-scope="scope">
              {{ scope.row.terminationRequestedName }}
            </template>
          </el-table-column>
          <el-table-column
            label="停止时间"
            min-width="100"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.terminatedAt }}
            </template>
          </el-table-column>
          <el-table-column label="开立医生" min-width="70" align="center">
            <template slot-scope="scope">
              {{ scope.row.prescribingDoctorName }}
            </template>
          </el-table-column>
          <el-table-column label="剂量" min-width="45" align="center">
            <template slot-scope="scope">
              {{ scope.row.dose }}
            </template>
          </el-table-column>
          <el-table-column
            label="用法"
            min-width="45"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.dosageRouteName }}
            </template>
          </el-table-column>
          <el-table-column label="频次" min-width="45" align="center">
            <template slot-scope="scope">
              {{ scope.row.freqCode }}
            </template>
          </el-table-column>
          <el-table-column label="执行者" min-width="70" align="center">
            <template slot-scope="scope">
              {{ "--" }}
            </template>
          </el-table-column>
          <el-table-column label="执行信息" min-width="70" align="center">
            <template slot-scope="scope">
              {{ "--" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="90" align="center">
            <template slot-scope="scope">
              <div class="handle">
                <!-- <div class="top">
                  <el-button
                    @click="handleStopClick(scope.row)"
                    type="text"
                    size="small"
                    >停止</el-button
                  >
                  <el-button type="text" size="small">取消</el-button>
                </div> -->
                <div class="bottom">
                  <el-button type="text" size="small">闭环</el-button>
                  <el-button type="text" size="small">指南</el-button>
                </div>
              </div>
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
    // 诊断信息接口，包含表格数据
    doctorOrderInfos: {
      required: true,
      type: Object,
      default: () => {},
    },
    // 父组件传来的当前页数
    currentPage: {
      required: true,
      type: Number,
      default: 1,
    },
    total: {
      required: true,
      type: Number,
    },
    pageSize: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      tableData: [
        {
          date: "2016-05-01 10:00:00",
          contents: "炫迈鸡肝颗粒",
          types: "长期",
          stopPerson: "张三",
          stopTime: "2016-05-01",
          openDoctor: "李四",
          unit: "1片",
          useage: "口服",
          frequency: "bid",
          executor: "李护士",
          executorInfos: "查看详情",
        },
        {
          date: "2016-05-02 10:00:00",
          contents: "三七药片",
          types: "长期",
          stopPerson: "张三",
          stopTime: "2016-05-01",
          openDoctor: "李四",
          unit: "2片",
          useage: "口服",
          frequency: "bid",
          executor: "李护士",
          executorInfos: "查看详情",
        },
        {
          date: "2016-05-02 10:00:00",
          contents: "躯壳药片",
          types: "长期",
          stopPerson: "张三",
          stopTime: "2016-05-01",
          openDoctor: "李四",
          unit: "3片",
          useage: "口服",
          frequency: "bid",
          executor: "李护士",
          executorInfos: "查看详情",
        },
        {
          date: "2016-04-29 10:00:00",
          contents: "三九感冒灵颗粒",
          types: "长期",
          stopPerson: "张三",
          stopTime: "2016-05-01",
          openDoctor: "李四",
          unit: "2片",
          useage: "口服",
          frequency: "bid",
          executor: "李护士",
          executorInfos: "查看详情",
        },
      ],
      multipleSelection: [], // 复选框选中的内容
      spanArr: [], // 用于存放每一行记录的合并数
    };
  },
  mounted() {
    // 处理表格的数据 按天进行内容合并
    // this.getSpanArr(this.tableData);
  },
  methods: {
    // 处理分页器的两个事件
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.$emit("update:pageSize", val);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // -1是因为父组件从0开始的
      this.$emit("update:currentPage", val - 1);
    },

    // 第一列的选复选框的时间
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    // 点击表格停止
    handleStopClick(row) {
      console.log(row);
    },
    // 处理合并单元格数据
    // getSpanArr(data) {
    //   for (let i = 0; i < data.length; i++) {
    //     if (i === 0) {
    //       this.spanArr.push(1);
    //       this.pos = 0;
    //     } else {
    //       // 后台返回数据得考虑到先把他给按日期排序
    //       data.sort(function (a, b) {
    //         return Date.parse(a.date) - Date.parse(b.date); // 时间正序
    //       });
    //       // 判断当前元素与上一个元素是否相同
    //       if (data[i].date === data[i - 1].date) {
    //         this.spanArr[this.pos] += 1;
    //         this.spanArr.push(0);
    //       } else {
    //         this.spanArr.push(1);
    //         this.pos = i;
    //       }
    //     }
    //     // console.log(this.spanArr);
    //   }
    // },
    // 合并单元格方法 {当前行，当前列，单前行号，单前列号}
    // combineTableMethod({ row, column, rowIndex, columnIndex }) {
    //   // console.log(row, column, rowIndex, columnIndex);
    //   if (
    //     columnIndex === 0 ||
    //     columnIndex === 1 ||
    //     columnIndex === 10 ||
    //     columnIndex === 11 ||
    //     columnIndex === 12
    //   ) {
    //     const _row = this.spanArr[rowIndex];
    //     const _col = _row > 0 ? 1 : 0;
    //     console.log(`rowspan:${_row} colspan:${_col}`);
    //     return {
    //       // [0,0] 表示这一行不显示， [2,1]表示行的合并数
    //       rowspan: _row,
    //       colspan: _col,
    //     };
    //   }
    // },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.doctorOrder-wrap {
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
        font-size: 16px !important;
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
      .handle {
        .top {
        }
        .bottom {
        }
      }
    }
    // 设置table max-height后table右侧滚动条消失BUG
    /deep/.el-table__body-wrapper {
      max-height: calc(50vh - 45px);
    }
    .el-table {
      cursor: pointer;
      font-size: 16px !important;
      .cell {
        .el-button--text {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
