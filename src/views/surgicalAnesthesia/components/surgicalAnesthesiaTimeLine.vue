<template>
  <!-- inspectReport页面的的左下时间线页面组件 -->
  <div class="timeline-wrap">
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="item in timeLineData.content"
          :key="item.encounterId"
          :color="toggleIndex === item.encounterId ? '#2d5afb' : ''"
          @click.native="toggleCard(item)"
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
            <div class="title">
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
                :key="items.index"
                :class="{ active: currentIndex === items.medtechRptId }"
                @click="liClick(items.medtechRptId)"
              >
                <span>
                  <span class="error" v-if="items.ycbz">*</span>
                  <span class="times">
                    {{ items.inspectionAt || "-" }}
                  </span>
                  <span class="contents">
                    {{ items.medtechRptTypeName || "-" }}
                  </span>
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
      toggleIndex: "", // 第一个时间轴远点颜色的索引
    };
  },

  mounted() {
    // 挂载先渲染第一条
    this.toggleIndex = this.timeLineData.content[0].encounterId;
  },

  methods: {
    toggleCard(index) {
      this.$emit("changeTableClickCard", index);
      // 切换卡片时间轴也要变色
      this.toggleIndex = index.encounterId;
    },

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
