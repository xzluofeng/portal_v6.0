<template>
  <!-- medicalPerscription面的的右下角报告的具体内容页面组件 -->
  <div class="medicalPerscription-wrap">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="header">
        <span class="title">处方信息</span>
        <span class="buttons">
          <!-- <el-button type="primary" class="button"> 引用处方 </el-button> -->
        </span>
      </div>
      <!-- 内容区域 -->
      <div class="text item">
        <!-- 数据是否来自于接口？先隐藏 -->
        <!-- <div class="totalpayment" v-if="false">
          <span class="first">总金额：</span>
          <span class="second">￥</span>
          <span class="third">{{ totalPrice }}</span>
        </div> -->
        <!-- 这个数据经常在变化 todo... -->
        <el-table
          :data="
            perscriptionInfo.content && perscriptionInfo.content[0].viewRecipe
          "
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
            label="开方时间"
            min-width="120"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.createRecipeAt }}
            </template>
          </el-table-column>
          <el-table-column
            label="处方内容"
            min-width="110"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.drugName }}
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="80" align="center">
            <template slot-scope="scope"> {{}} </template>
          </el-table-column>
          <el-table-column label="剂量" min-width="80" align="center">
            <template slot-scope="scope">
              {{ `${scope.row.dose || ""} ${scope.row.doseUnitName || ""}` }}
            </template>
          </el-table-column>
          <el-table-column
            label="用法"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.dosageRouteName }}
            </template>
          </el-table-column>
          <el-table-column label="频次" min-width="50" align="center">
            <template slot-scope="scope">
              {{ scope.row.freqCode }}
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="50" align="center">
            <template slot-scope="scope">
              {{ scope.row.totalQuantity }}
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="50" align="center">
            <template slot-scope="scope">
              {{ scope.row.drugUnitName }}
            </template>
          </el-table-column>
          <el-table-column label="金额" min-width="60" align="center">
            <template slot-scope="scope">
              {{ scope.row.recipeAmount }}
            </template>
          </el-table-column>
          <el-table-column label="结算标示" min-width="80" align="center">
            <template slot-scope="scope">
              <!-- 暂未填内容 -->
              <span
                :class="[
                  scope.row.settlementCode === '未结算' ? 'unPaid' : 'isPaid',
                ]"
              >
                {{ scope.row.settlementCode || "已结算" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="医生" min-width="60" align="center">
            <template slot-scope="scope">
              {{ scope.row.prescribingDoctorName }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80" align="center">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
                >闭环</el-button
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
    // 诊断信息接口，包含表格数据
    perscriptionInfo: {
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
  computed: {
    // 计算总价
    // totalPrice() {
    //   let totalPrice = 0;
    //   for (let i = 0; i < this.tableData.length; i++) {
    //     totalPrice += this.tableData[i].money * 1;
    //   }
    //   return totalPrice;
    // },
  },

  mounted() {
    // 处理表格的数据 按天进行内容合并
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
    // 点击表格闭环
    handleClick(row) {
      console.log(row);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.medicalPerscription-wrap {
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
      .totalpayment {
        float: left;
        padding-bottom: 20px;
        .first {
          font-size: 16px;
          font-weight: bold;
        }
        .second {
          font-size: 16px;
          color: #ff8a00;
        }
        .third {
          font-size: 22px;
          color: #ff8a00;
        }
      }
      // 表格里面的结算标志
      .isPaid {
        color: #00ab41;
        &::before {
          content: "";
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #00ab41;
        }
        vertical-align: middle;
      }
      .unPaid {
        color: #ff8b00;
        vertical-align: middle;
        &::before {
          content: "";
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ff8b00;
        }
      }
      // 设置table max-height后table右侧滚动条消失BUG
      /deep/.el-table__body-wrapper {
        max-height: calc(50vh - 45px);
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
      }
    }
  }
}
</style>
