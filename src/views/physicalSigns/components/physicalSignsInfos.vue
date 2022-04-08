<template>
  <div class="physicalSigns-wrap">
    <el-card class="box-card">
      <!-- 日期选择器 -->
      <div class="block">
        <el-date-picker
          class="startTime time"
          v-model="startDate"
          type="date"
          :clearable="false"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @click.native="clickData(startDate)"
        />
        <span
          class="time tags"
          v-for="item in nextTime[0]"
          :key="item.index"
          @click="clickData(item)"
        >
          {{ item }}
        </span>
      </div>
      <!-- 日期下对应的时间 -->
      <div class="dates">
        <span class="day" v-for="item in days" :key="item.days">
          {{ item }}天
        </span>
      </div>
      <!-- 点击小块 -->
      <button class="leftButton" @click="preWeekDate">
        <i class="el-icon el-icon-arrow-left"></i>
      </button>
      <button class="rightButton" @click="nextWeekDate">
        <i class="el-icon el-icon-arrow-right"></i>
      </button>

      <!-- echarts -->
      <div class="echart-contianer" ref="echarts" id="myCharts"></div>

      <!-- tables -->
      <el-table
        :data="physicalSignTable"
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
          prop="chartItemName"
          label="体征信息"
          min-width="120"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="date"
          v-for="(item, index) in tableOption[0]"
          :key="index"
          :label="item"
          min-width="120"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt[index] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import echart from "echarts";
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
      // 开始时间
      startDate: this.$moment(new Date("2022-03-21 00:00:00")).format(
        "YYYY-MM-DD"
      ),
      // 后续时间，自动生成
      nextTime: [],
      // 时间下面对应的日期
      days: [1, 2, 3, 4, 5, 6, 7],
      // table的数据
      physicalSignTable: [
        // {
        //   chartItemName: "体温(℃)",
        //   createdAt: [[1, 2, 3], 2, 3, "/", 0, 0, 0],
        // },
        // {
        //   chartItemName: "体温(℃)",
        //   createdAt: [[1, 2, 3], 2, 3, "/", 0, 0, 0],
        // },
      ],
      tableOption: [],

      // echarts横坐标数据
      xlineDataList: {
        hours: [
          1, 5, 9, 13, 17, 21, 1, 5, 9, 13, 17, 21, 1, 5, 9, 13, 17, 21, 1, 5,
          9, 13, 17, 21, 1, 5, 9, 13, 17, 21, 1, 5, 9, 13, 17, 21, 1, 5, 9, 13,
          17, 21,
        ],
        showTime: [],
      },

      // 体征接口列表数据 脉搏体温等
      xt: [],
      tw: [],
      mb: [],
      hx: [],
    };
  },
  watch: {
    // 开始日期可选，选后，后面跟着变化日期
    startDate: {
      handler(val) {
        // 给数组添加双向绑定
        this.$set(this.nextTime, 0, [
          this.$moment(val).add(1, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(2, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(3, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(4, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(5, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(6, "days").format("YYYY-MM-DD"),
        ]);
        this.$set(this.tableOption, 0, [
          this.$moment(val).format("YYYY-MM-DD"),
          this.$moment(val).add(1, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(2, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(3, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(4, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(5, "days").format("YYYY-MM-DD"),
          this.$moment(val).add(6, "days").format("YYYY-MM-DD"),
        ]);
      },
      deep: true,
      immediate: true,
    },
    // 挂载调用可能会出BUG，侦听到timelineData渲染后调用可以解决时间轴渲染顺序BUG
    timeLineData: {
      handler(val) {
        // 1. (初始化第一条)
        this.initEchartsData();
      },
      deep: true,
    },
    singleTimeLineInfo: {
      handler(val) {
        // 1. (侦听到的时间轴点击后的任意条)
        this.initEchartsData(val);
      },
      deep: true,
    },
  },

  computed: {
    // 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos", "timeLineData", "patientInfo"]),
  },

  mounted() {
    // this.initEchartsData();
    // echarts相关代码
    this.initChart();
  },
  methods: {
    // 调接口拿数据
    async initEchartsData(val) {
      try {
        let params = {};
        if (!val) {
          // 不传参就是第一次调用这个参数
          params = {
            encounterId: this.timeLineData.content[0].encounterId, // 就诊流水号
            hospitalSoid: this.timeLineData.content[0].hospitalSoid, // 医疗机构代码
            encounterTypeNo: this.timeLineData.content[0].encounterTypeNo, // 就诊类别
            pageIndex: "0",
            pageSize: "100",
          };
        } else {
          // 有传参就是第二次用这个
          params = {
            encounterId: val.encounterId, // 就诊流水号
            hospitalSoid: val.hospitalSoid, // 医疗机构代码
            encounterTypeNo: val.encounterTypeNo, // 就诊类别
            pageIndex: "0",
            pageSize: "100",
          };
        }
        const data = await this.$api.getVitalSignList(params);

        // this.physicalSignTable = data.content; // table用
        const tableArr = JSON.parse(JSON.stringify(data.content));
        // table的格式转换算法
        // 1.处理成以chartItemName为属性名不重复的对象，值为当前某条对象的数组
        const obj = tableArr.reduce((prev, curr) => {
          if (!prev[curr.chartItemName]) {
            prev[curr.chartItemName] = [];
          }
          prev[curr.chartItemName].push(curr);
          return prev;
        }, {});
        const result = {};
        // 2. 遍历上面的对象
        for (const key in obj) {
          result[key] = {};
          // 2.1 遍历每条chartItemName为属性名的值（值为对象）成{name:{tiem:[value]}}
          obj[key].reduce((prev, curr) => {
            const arr = curr.createdAt.split(" ");
            console.log(arr[0]);
            if (!prev[arr[0]]) {
              prev[arr[0]] = [];
            }
            prev[arr[0]].push(curr.numberValue);
            return prev;
          }, result[key]);
        }
        console.log(data);
        console.log(obj);
        console.log(result);
        // 3.{name:{tiem:[value]}}转成目标样式 [ {chartItemName:'',createAt:[ 7条]},{}]
        const arrResult = [];
        for (const key in result) {
          const obj1 = {};
          obj1.chartItemName = key;
          obj1.createdAt = new Array(7).fill("/");
          let index = 0;
          for (const i in result[key]) {
            if (result[key][i].length === 1) {
              obj1.createdAt[index] = result[key][i][0];
            } else {
              obj1.createdAt[index] = result[key][i];
            }
            index++;
          }
          arrResult.push(obj1);
        }
        console.info(arrResult, "tableArr");
        this.physicalSignTable = arrResult;

        // echarts数据转换的算法
        // 时间点   4个节点或者6个节点
        const time = [];
        let a = this.startDate;
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 6; j++) {
            if (j * 4 + 1 < 10) {
              time.push(`${a} 0${j * 4 + 1}:00:00`);
            } else {
              time.push(`${a} ${j * 4 + 1}:00:00`);
            }
          }
          a = this.$moment(a).add(1, "days").format("YYYY-MM-DD");
        }
        this.xlineDataList.showTime = time;

        // 处理体温数据  处理返回数据取点的逻辑
        const newtime = [1, 5, 9, 13, 17, 21];
        for (let j = 0; j < data.content.length; j++) {
          const hours = data.content[j].createdAt.substring(11, 13);
          let currentHour = 0;
          for (let i = 0; i < newtime.length; i++) {
            if (hours <= newtime[i]) {
              currentHour = newtime[i];
              break;
            } else if (i + 1 < newtime.length && hours <= newtime[i + 1]) {
              if (
                Math.abs(newtime[i + 1] - hours) <= Math.abs(newtime[i] - hours)
              ) {
                currentHour = newtime[i + 1];
              } else {
                currentHour = newtime[i];
              }
              break;
            }
          }
          if (currentHour === 0) {
            currentHour = 21;
          }
          data.content[j].createdNew =
            data.content[j].createdAt.substring(0, 10) +
            " " +
            (currentHour < 10 ? "0" + currentHour : currentHour) +
            data.content[j].createdAt.substring(13, 19);
        }
        console.log(data.content, "data.content");

        // 体温
        const twArr = data.content.filter((item) => {
          if (item.chartItemNo === "TW") {
            return item;
          }
        });
        twArr.sort(function (a, b) {
          return new Date(a.createdNew) - new Date(b.createdNew);
        });
        const resultTW = [];
        for (let i = 0; i < time.length; i++) {
          let value = null;
          for (let j = 0; j < twArr.length; j++) {
            if (time[i] === twArr[j].createdNew) {
              value = twArr[j].numberValue;
              break;
            }
          }
          resultTW.push(value);
        }
        this.tw = resultTW;

        // 脉搏
        const mbArr = data.content.filter((item) => {
          if (item.chartItemNo === "MB") {
            return item;
          }
        });
        mbArr.sort(function (a, b) {
          return new Date(a.createdNew) - new Date(b.createdNew);
        });
        const resultMB = [];
        for (let i = 0; i < time.length; i++) {
          let value = null;
          for (let j = 0; j < mbArr.length; j++) {
            if (time[i] === mbArr[j].createdNew) {
              value = mbArr[j].numberValue;
              break;
            }
          }
          resultMB.push(value);
        }
        this.mb = resultMB;

        // 呼吸
        const hxArr = data.content.filter((item) => {
          if (item.chartItemNo === "HX") {
            return item;
          }
        });
        hxArr.sort(function (a, b) {
          return new Date(a.createdNew) - new Date(b.createdNew);
        });
        const resultHX = [];
        for (let i = 0; i < time.length; i++) {
          let value = null;
          for (let j = 0; j < hxArr.length; j++) {
            if (time[i] === hxArr[j].createdNew) {
              value = hxArr[j].numberValue;
              break;
            }
          }
          resultHX.push(value);
        }
        this.hx = resultHX;

        // 接口调完后再刷下echarts
        this.initChart();
      } catch (error) {
        console.log(error);
      }
    },

    // 初始化echarts
    initChart() {
      var myChart = echart.init(this.$refs.echarts);
      const option = {
        backgroundColor: "#ffffff",
        // 标题
        title: {
          // text: "患者体温趋势",
          textStyle: {
            fontSize: "16",
            color: "#ccc",
          },
          // subtext: "体温",
          x: "7%",
          y: "5px",
        },
        // 提示框
        tooltip: {
          trigger: "axis",
          backgroundColor: "#ffffff",
          textStyle: {
            fontSize: 14,
            color: "#101010",
          },
          extraCssText: "box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);",
        },

        color: ["#77e3e3", "#ff8536", "#f6db5b", "#2e6ae6"], // 设置后，legend颜色就和线条一致了
        legend: {
          icon: "circle", // 类型圆形
          data: ["血糖", "体温", "脉搏", "呼吸"],
          right: 10,
          bottom: 5,
        },
        // x轴
        xAxis: [
          {
            type: "category",
            data: this.xlineDataList.hours,
            // 轴标签格式
            axisLabel: {
              color: "#101010",
              textStyle: {
                color: "#101010",
                fontFamily: "sans-serif",
                fontSize: 10,
                fontStyle: "italic",
              },
            },
            // 轴线样式
            axisLine: {
              lineStyle: {
                color: "#666666",
                width: 1, // 这里是为了突出显示加上的
              },
            },
            // 可修改该x轴数据在提示框显示的样式
            axisPointer: {
              label: {
                formatter: (params, index) => {
                  if (params.seriesData.length === 0) {
                    return "";
                  }
                  // [params.seriesData[0].dataIndex]; 就是索引
                  return this.xlineDataList.showTime[
                    params.seriesData[0].dataIndex
                  ];
                },
              },
            },
          },
        ],

        yAxis: [
          {
            name: "血\n糖",
            nameTextStyle: {
              padding: [0, 7, 0, 0],
              color: "#77e3e3",
              align: "right",
              lineHeight: 13,
            }, // y轴文字样式
            type: "value",
            min: 0, // 最小
            max: 40, // 最多
            splitNumber: 10, // 设置y轴刻度间隔个数
            position: "left",
            offset: 0, // 轴线偏移量
            axisLine: {
              // y轴线不显示
              show: true,
            },
            splitLine: {
              // 网格线
              lineStyle: {
                type: "dashed", // 设置网格线类型 dotted：虚线   solid:实线
              },
              show: true, // 隐藏或显示
            },
            // 轴标签格式
            axisLabel: {
              color: "#101010",
              // formatter定制提示文字格式
              formatter: "{value}",
            },
            // 轴刻度线
            axisTick: {
              // y轴刻度线不显示
              show: false,
            },
          },
          {
            name: "体\n温",
            nameTextStyle: {
              padding: [0, 7, 0, 0],
              align: "right",
              color: "#ff8536",
              lineHeight: 13,
            }, // y轴文字样式
            type: "value",
            min: 34, // 最小
            max: 42, // 最多
            splitNumber: 10, // 设置y轴刻度间隔个数
            position: "left",
            offset: 30, // 轴线偏移量
            axisLine: {
              // y轴线不显示
              show: false,
            },
            splitLine: {
              // 网格线
              lineStyle: {
                type: "dashed", // 设置网格线类型 dotted：虚线   solid:实线
              },
              show: true, // 隐藏或显示
            },
            // 轴标签格式
            axisLabel: {
              color: "#101010",
              // formatter定制提示文字格式
              formatter: "{value}",
            },
            // 轴刻度线
            axisTick: {
              // y轴刻度线不显示
              show: false,
            },
          },
          {
            name: "脉\n搏",
            nameTextStyle: {
              padding: [0, 7, 0, 0],
              align: "right",
              color: "#f6db5b",
              lineHeight: 13,
            },
            type: "value",
            min: 40, // 最小
            max: 200, // 最多
            splitNumber: 10, // 设置y轴刻度间隔个数
            position: "left",
            offset: 60, // 轴线偏移量
            axisLine: {
              // y轴线不显示
              show: false,
            },
            splitLine: {
              // 网格线
              lineStyle: {
                type: "dashed", // 设置网格线类型 dotted：虚线   solid:实线
              },
              show: true, // 隐藏或显示
            },
            // 轴标签格式
            axisLabel: {
              color: "#101010",
              // formatter定制提示文字格式
              formatter: "{value}",
            },
            // 轴刻度线
            axisTick: {
              // y轴刻度线不显示
              show: false,
            },
          },
          {
            name: "呼\n吸",
            nameTextStyle: {
              padding: [0, 7, 0, 0],
              align: "right",
              color: "#2e6ae6",
              lineHeight: 13,
            },
            type: "value",
            min: 10, // 最小
            max: 90, // 最多
            splitNumber: 10, // 设置y轴刻度间隔个数
            position: "left",
            offset: 90, // 轴线偏移量
            axisLine: {
              // y轴线不显示
              show: false,
            },
            splitLine: {
              // 网格线
              lineStyle: {
                type: "dashed", // 设置网格线类型 dotted：虚线   solid:实线
              },
              show: true, // 隐藏或显示
            },
            // 轴标签格式
            axisLabel: {
              color: "#101010",
              // formatter定制提示文字格式
              formatter: "{value}",
            },
            // 轴刻度线
            axisTick: {
              // y轴刻度线不显示
              show: false,
            },
          },
        ],

        // 直角坐标系内绘图网格大小样式设置
        grid: {
          left: "2%", // 左偏
          right: "2%",
          bottom: "40", // 值越大X轴下方的高度越大
          containLabel: true,
        },

        // 图表类型  介入数据在此
        series: [
          {
            yAxisIndex: 0, // 设置系列属性 对应参考系的值 多Y轴必设
            name: "血糖",
            data: [],
            type: "line",
            // smooth: true,
            // 设置折线颜色
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#77e3e3",
                },
              },
            },
          },
          {
            yAxisIndex: 1,
            name: "体温",
            data: this.tw,
            type: "line",
            // smooth: true,
            // 设置折线颜色
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#ff8536",
                },
              },
            },
          },
          {
            yAxisIndex: 2,
            name: "脉搏",
            data: this.mb,
            type: "line",
            // smooth: true,
            // 设置折线颜色
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#f6db5b",
                },
              },
            },
          },
          {
            yAxisIndex: 3,
            name: "呼吸",
            data: this.hx,
            type: "line",
            // smooth: true,
            // 设置折线颜色
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#2e6ae6",
                },
              },
            },
          },
        ],
      };
      option && myChart.setOption(option, true);
    },

    // 点击上个周时间按钮
    preWeekDate() {
      // 日期
      this.startDate = this.$moment(this.startDate)
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      // 底部天数 掉接口还是自己计算 todo..
    },
    // 点击下一周时间按钮
    nextWeekDate() {
      this.startDate = this.$moment(this.startDate)
        .add(7, "days")
        .format("YYYY-MM-DD");
      // 底部天数 掉接口还是自己计算 todo..
    },

    // 点击时间按钮
    clickData(item) {
      console.log(item);
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.physicalSigns-wrap {
  .box-card {
    width: calc(100% - 55px);
    height: 685px;
    margin-left: 40px;
    font-size: 16px;
    position: relative;
    overflow-y: auto;
    @include scrollBar;
    // echarts上的日期
    .block {
      position: absolute;
      left: 170px;
      top: 8px;
      z-index: 999;
      .time {
        transform: scale(0.9);
        width: 145px;
        height: 30px;
        margin-right: 2px;
        background-color: #d8e2ff;
        /deep/.el-input__inner {
          background-color: #d8e2ff;
        }
      }
      .tags {
        transform: scale(0.95);
        display: inline-block;
        cursor: pointer;
        width: 145px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border: 1px solid #c9c9c9;
        border-radius: 3px;
        color: black;
      }
    }

    // 日期下对应的天数
    .dates {
      position: absolute;
      left: 170px;
      top: 48px;
      z-index: 999;
      .day {
        transform: scale(0.95);
        display: inline-block;
        cursor: pointer;
        margin-right: 2px;
        width: 145px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: black;
      }
    }
    // 左右可点击切换按钮
    .leftButton {
      position: absolute;
      left: 130px;
      top: 10px;
      height: 30px;
      background-color: #d8e2ff;
      border: 1px solid #c9c9c9;
      border-radius: 3px;
      cursor: pointer;
      z-index: 999;
      i {
        color: #8599c0;
        font-weight: 700;
      }
    }
    .rightButton {
      position: absolute;
      right: 10px;
      top: 10px;
      height: 32px;
      background-color: #d8e2ff;
      border: 1px solid #c9c9c9;
      border-radius: 3px;
      cursor: pointer;
      z-index: 999;
      i {
        color: #8599c0;
        font-weight: 700;
      }
    }

    .echart-contianer {
      width: 100%;
      height: 500px;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 20px;
    }
  }
}
</style>
