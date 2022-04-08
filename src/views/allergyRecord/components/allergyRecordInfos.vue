<template>
  <div class="allergyRecord-wrap">
    <el-card class="box-card">
      <!-- 内容区域 -->
      <div class="text item">
        <!-- 没联调写死数据 -->
        <el-table
          :data="allergyRecordTable"
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
        >
          <el-table-column
            label="过敏类型"
            min-width="100"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
          <el-table-column
            label="过敏原"
            min-width="110"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.source }}
            </template>
          </el-table-column>
          <el-table-column
            label="过敏发现时间"
            min-width="120"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.findTime }}
            </template>
          </el-table-column>
          <el-table-column label="皮试结果" min-width="100" align="center">
            <template slot-scope="scope">
              <span
                :style="{
                  color:
                    scope.row.result.indexOf('阴') === -1 ? 'red' : 'green',
                }"
              >
                {{ scope.row.result }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="症状"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.sign }}
            </template>
          </el-table-column>
          <el-table-column label="严重程度" min-width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.level }}
            </template>
          </el-table-column>
          <el-table-column label="皮试批号" min-width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.number }}
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
      allergyRecordTable: [
        {
          type: "皮试",
          source: "牛奶",
          findTime: "2022-3:-20 10:10:10",
          result: "阴性",
          sign: "",
          level: "",
          number: "",
        },
        {
          type: "皮试",
          source: "头孢菌素类",
          findTime: "2022-3:-20 10:10:10",
          result: "阳性",
          sign: "",
          level: "",
          number: "",
        },
        {
          type: "皮试",
          source: "牛奶",
          findTime: "2022-3:-20 10:10:10",
          result: "阴性",
          sign: "",
          level: "",
          number: "",
        },
        {
          type: "皮试",
          source: "头孢菌素类",
          findTime: "2022-3:-20 10:10:10",
          result: "重度阳性",
          sign: "",
          level: "",
          number: "",
        },
        {
          type: "皮试",
          source: "头孢菌素类",
          findTime: "2022-3:-20 10:10:10",
          result: "阳性",
          sign: "",
          level: "",
          number: "",
        },
        {
          type: "皮试",
          source: "牛奶",
          findTime: "2022-3:-20 10:10:10",
          result: "阴性",
          sign: "",
          level: "",
          number: "",
        },
        {
          type: "皮试",
          source: "头孢菌素类",
          findTime: "2022-3:-20 10:10:10",
          result: "重度阳性",
          sign: "",
          level: "",
          number: "",
        },
      ],
      // table
      allergyList: [],
      // 分页器1
      currentPage: 0,
      total: 0,
      pageSize: 5,
    };
  },

  watch: {
    // 挂载调用可能会出BUG，侦听到timelineData渲染后调用可以解决时间轴渲染顺序BUG
    timeLineData: {
      handler(val) {
        // 1. 手术信息(初始化第一条)
        this.getFirstallergyListInfo();
      },
      deep: true,
    },
    singleTimeLineInfo: {
      handler(val) {
        // 1. 手术信息(侦听到的时间轴点击后的任意条)
        this.getFirstallergyListInfo(val);
      },
      deep: true,
    },
  },

  computed: {
    // 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos", "timeLineData", "patientInfo"]),
  },

  mounted() {
    // 处理表格的数据 按天进行内容合并
  },
  methods: {
    // 1.手术信息 先拿到时间轴第一条数据作参数渲染右侧手术信息
    async getFirstallergyListInfo(val) {
      try {
        let params = {};
        if (!val) {
          // 第一次调
          params = {
            encounterId: this.timeLineData.content[0].encounterId, // 就诊流水号
            hospitalSoid: this.timeLineData.content[0].hospitalSoid, // 医疗机构代码
            encounterTypeNo: this.timeLineData.content[0].encounterTypeNo, // 就诊类别
            pageIndex: "0",
            pageSize: "100",
          };
        } else {
          // 切换时间轴后调
          params = {
            encounterId: val.encounterId, // 就诊流水号
            hospitalSoid: val.hospitalSoid, // 医疗机构代码
            encounterTypeNo: val.encounterTypeNo, // 就诊类别
            pageIndex: "0",
            pageSize: "100",
          };
        }
        const data = await this.$api.getAllergyList(params);
        this.allergyList = data.content[0];
      } catch (error) {
        console.log(error);
      }
    },

    // 处理分页器的两个事件
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // this.$emit("update:pageSize", val);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // -1是因为父组件从0开始的
      this.currentPage = val - 1;
      // this.$emit("update:currentPage", val - 1);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.allergyRecord-wrap {
  .box-card {
    width: calc(100% - 55px);
    height: 685px;
    margin-left: 40px;
    font-size: 16px;
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
