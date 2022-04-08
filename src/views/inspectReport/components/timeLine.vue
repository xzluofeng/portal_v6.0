<template>
  <!-- inspectReport页面的的左下时间线页面组件 -->
  <div class="timeline-wrap">
    <div class="block">
      <el-timeline>
        <!-- <el-timeline-item v-for="item in lisreportEntityList" :key="item.id"> -->
        <el-timeline-item
          v-for="item in newTimeLineData.content"
          :key="item.encounterId"
          @click.native="toggleCard(item)"
          :color="toggleIndex === item.encounterId ? '#2d5afb' : ''"
        >
          <div class="items">
            <div class="time">
              <div class="startTime">
                {{ $moment(item.visitStartTime).format("YYYY-MM-DD") }}
              </div>
              <!-- 做v-if判断是否有截止时间 -->
              <template
                v-if="item.visitEndTime && item.encounterTypeNo !== '1'"
              >
                <span class="as">至</span>
                <div class="endTime">
                  {{ $moment(item.visitEndTime).format("YYYY-MM-DD") }}
                </div>
              </template>
            </div>
            <div class="details">
              <span class="tags">{{ item.encounterTypeName }}</span>
              <span class="illnessType">【{{ item.inDeptName }}】</span>
              <span class="institution">{{ item.hospitalName }}</span>
            </div>
          </div>
          <!-- 内容 -->
          <el-card
            class="cardContent"
            :class="toggleIndex === item.encounterId ? 'showCardColor' : ''"
          >
            <div class="title" @click="getlineData(item)">
              <p>
                <span>
                  <span class="circle">{{ "主" }}</span>
                  <span class="ills" v-if="item.viewDiagnosisPrincipal">
                    {{
                      item.viewDiagnosisPrincipal.length > 0
                        ? item.viewDiagnosisPrincipal[0].diagnosisName
                        : "--"
                    }}
                  </span>
                </span>
                <span>{{ item.scheduledDoctorName }}</span>
              </p>
            </div>
            <div class="mainContent">
              <p
                v-for="items in item.innerContent"
                :key="items.medtechRptId"
                :class="{ active: currentIndex === items.medtechRptId }"
                @click="liClick(items.medtechRptId)"
              >
                <span @click="getReportContent(items)">
                  <span class="error" v-if="items.ycbz">*</span>
                  <span class="times">
                    {{ items.inspectionAt || "-" }}
                  </span>
                  <span class="contents">{{
                    items.medtechRptTypeName || "-"
                  }}</span>
                </span>
              </p>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    timeLineData: {
      required: true,
      type: Object,
      default: () => {},
    },
  },
  computed: {
    // 获取vuex中的属性
    ...mapState(["userMessage", "infos", "patientInfo"]),
  },

  data() {
    return {
      currentIndex: "", // 点击每行的索引 时间轴内容文字点击内容变色
      toggleIndex: "", // 第一个时间轴远点颜色的索引
      newTimeLineData: {}, // 渲染时间线的 拷贝的timeline数据进行双向绑定
    };
  },

  watch: {
    // 搜索的时候会改变infos从而改变timelineData，因为要侦听重新渲染
    // 搜索会跳到此页面，所以这个页面侦听即可
    timeLineData: {
      handler: function (val, oldval) {
        // 拷贝一份时间线数据
        this.newTimeLineData = JSON.parse(JSON.stringify(val));
        // 第一条的卡片内容数据
        this.getSingleLineData();
        // 初始化拿到第一条的颜色
        this.currentIndex = val.content[0].medtechRptId;
        this.toggleIndex = val.content[0].encounterId;
      },
      deep: true,
      // immediate: true,
    },
  },

  mounted() {},

  methods: {
    //  初始化渲染时间轴第一条的卡片内容数据
    async getSingleLineData() {
      try {
        const params = {
          bizRoleId: this.patientInfo.content[0].bizRoleId,
          encounterId: this.timeLineData.content[0].encounterId,
          encounterTypeNo: this.timeLineData.content[0].encounterTypeNo || "",
          hospitalSoid: this.timeLineData.content[0].hospitalSoid || "",
          pageIndex: "0",
          pageSize: "10",
        };
        // 获取检查报告列表 /getRisReportList
        const data = await this.$api.getRisReportResultList(params);
        // 这个数据用来渲染时间轴某项下面的数据 又可以填充右侧的数据
        // 找到对应的就诊流水号
        this.$set(this.newTimeLineData.content, 0, {
          ...this.newTimeLineData.content[0],
          innerContent: data.content,
        });
        // 先传一次timeLineContent的第一条数据渲染右侧上面内容
        this.$emit("timeLineContentClick", data.content[0]);
        // // 默认让第一条为选中颜色
        this.currentIndex = data.content[0].medtechRptId;
        // // 默认让第一个卡片的时间轴颜色变色
        // this.toggleIndex = data.content[0].encounterId;
        // this.totimeLineContent = data
        // this.total = data.totalElements
      } catch (error) {
        console.log(error);
      }
    },

    // 点击某条时间线头部的时候调接口拿到其卡片内容
    async getlineData(info) {
      console.log("卡片头部", info);
      try {
        const params = {
          bizRoleId: this.patientInfo.content[0].bizRoleId,
          encounterId: info.encounterId,
          encounterTypeNo: info.encounterTypeNo,
          hospitalSoid: info.hospitalSoid,
          pageIndex: "0",
          pageSize: "100",
        };
        const data = await this.$api.getRisReportResultList(params);
        // 这个数据用来渲染时间轴某项下面的数据 又可以填充右侧的数据
        // 找到对应的就诊流水号
        this.newTimeLineData.content.forEach((items, index) => {
          // info.encounterId替换原来返回的encounterId 修复BUG
          if (info.encounterId === items.encounterId) {
            this.$set(this.newTimeLineData.content, index, {
              ...this.newTimeLineData.content[index],
              innerContent: data.content,
            });
          }
        });

        //  将当前时间轴的医技号给到currentId 渲染第一条的颜色
        this.currentIndex = data.content[0].medtechRptId;
        // 点击头部的时候，默认右侧调第一行的数据
        this.getReportContent(data.content[0]);
        // this.totimeLineContent = data
        // this.total = data.totalElements
      } catch (error) {
        console.log(error);
      }
    },

    // 点击不同的报告内容  调不同的patientId
    getReportContent(item) {
      console.log("报告内容2", item);
      // 点击不同的内容，传给父组件--再传给内容子组件去渲染内容
      this.$emit("timeLineContentClick", item);
    },

    // 点击不同的时间线的时候切换不同的卡片，调不同的人物信息
    async toggleCard(index) {
      console.log("时间线", index);
      try {
        const params = {
          encounterId: index.encounterId, // 就诊流水号
          hospitalSoid: index.hospitalSoid, // 医疗机构代码
          encounterTypeNo: index.encounterTypeNo, // 就诊类别
          pageIndex: "0", // 分页序号(从0开始)
          pageSize: "100", // 页面展示数量
        };
        const data = await this.$api.getPatientByEncounterId(params);
        // patientInfo变化后丢给vuex让layout页面侦听变化修改人名
        this.$store.commit("SET_PatientInfo", data);
        // 切换卡片时间轴也要变色
        this.toggleIndex = index.encounterId;
      } catch (error) {
        console.log(error);
      }
    },

    // 点击某行
    liClick(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style lang='scss' scoped>
.timeline-wrap {
  margin-top: 10px;
  .block {
    // 头部事件区域
    .items {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;

      margin-bottom: 10px;
      .time {
        .as {
          display: inline-block;
          color: #c0c0c0;
          padding: 5px 0px 5px 20px;
        }
      }
      .details {
        // 让其超出部分不显示
        width: 380px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        .tags {
          display: inline-block;
          padding: 2px 5px;
          border-radius: 5px;
          background-color: #ebeeff;
          margin-left: 10px;
          color: #2d5afb;
        }
        .locations {
          margin-left: 5px;
        }
      }
    }
    // 底部内容区域
    .cardContent {
      font-size: 16px;
      .title {
        border-bottom: 1px solid #ccc;
        p {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          .circle {
            display: inline-block;
            width: 22px;
            height: 22px;
            text-align: center;
            margin-right: 5px;
            color: #eaf7f0;
            background-color: #26b46c;
            border-radius: 50%;
            font-size: 14px;
            padding: 2px;
          }
          .ills {
            vertical-align: middle;
          }
        }
      }
      .mainContent {
        .active {
          color: #2d5afb;
        }
        cursor: pointer;
        p {
          padding: 10px;
          .contents {
            margin-left: 15px;
          }
          .error {
            vertical-align: middle;
            color: red;
          }
          &:hover {
            color: #2d5afb;
          }
        }
      }
    }
    .showCardColor {
      background-color: #f5f5f5;
    }
  }
}
</style>
