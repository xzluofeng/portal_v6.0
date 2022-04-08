<template>
  <!-- 诊断信息页面的的右下角报告的具体内容页面组件 -->
  <div class="doctorOrder-wrap">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="header">
        <span class="title">诊断信息</span>
      </div>
      <!-- 内容区域 -->
      <div class="text item">
        <el-table
          :data="diagnosisInfo.content"
          border
          max-height="51vh"
          tooltip-effect="dark"
          style="width: 100%; border: 1px solid #ccc"
          :header-cell-style="{
            background: '#ebeeff',
            color: '#606266',
            borderColor: '#ccc',
          }"
          :cell-style="{ borderColor: '#ccc' }"
        >
          <el-table-column
            label="诊断时间"
            min-width="100"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.diagnosisDate }}
            </template>
          </el-table-column>
          <el-table-column label="诊断名称" min-width="120" align="center">
            <template slot-scope="scope">
              <span class="main" v-if="scope.row.balance || true">
                <span class="txt">主</span>
              </span>
              {{ scope.row.diagnosisName }}
            </template>
          </el-table-column>
          <!-- 缺数据 -->
          <el-table-column label="诊断说明" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.diagnosisDesc }}
            </template>
          </el-table-column>
          <el-table-column label="类别" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.diagnosisTypeName }}
            </template>
          </el-table-column>
          <el-table-column label="诊断医生" min-width="80" align="center">
            <template slot-scope="scope">
              {{ scope.row.diagnosisDoctorName }}
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
    diagnosisInfo: {
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
      multipleSelection: [], // 复选框选中的内容
      spanArr: [], // 用于存放每一行记录的合并数
    };
  },
  mounted() {},
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
        font-size: 16px;
        &::before {
          content: "";
          border-left: 5px solid #2d5afb;
          margin-right: 8px;
        }
      }
    }
    // 内容区域
    .item {
      height: 620px;
      overflow-y: auto;
      @include scrollBar;
      margin-bottom: 18px;
      .main {
        display: inline-block;
        position: absolute;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        background: #24b46c;
        font-size: 12px;
        color: #fff;
        text-align: center;
        line-height: 18px;
        transform: translateX(-25px);
        .txt {
          display: inline-block;
          transform: scale(0.8);
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
