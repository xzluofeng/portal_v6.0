<!--
 * @Date: 2022-03-29 18:05:45
 * @LastEditors: Zhibing Wang
 * @LastEditTime: 2022-04-08 09:24:01
 * @FilePath: \portal_v6.0\src\views\allergyRecord\components\allergyRecordTimeLine.vue
-->
<template>
  <!-- inspectReport页面的的左下时间线页面组件 -->
  <div class="timeline-wrap">
    <div class="block">
      <el-timeline>
        <!-- <el-timeline-item v-for="item in lisreportEntityList" :key="item.id"> -->
        <el-timeline-item
          v-for="item in timeLineData.content"
          :key="item.encounterId"
          @click.native="toggleCard(item)"
          :color="toggleIndex === item.encounterId ? '#2d5afb' : ''"
        >
          <!-- 内容 -->
          <el-card
            class="cardContent"
            :class="toggleIndex === item.encounterId ? 'showCardColor' : ''"
          >
            <div class="title">
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
                    <div class="endTime">{{ item.visitEndTime }}</div>
                  </template>
                </div>
                <div class="details">
                  <span class="tags">{{ item.encounterTypeName }}</span>
                  <span class="illnessType">【{{ item.inDeptName }}】</span>
                  <span class="institution">{{ item.hospitalName }}</span>
                </div>
              </div>
            </div>
            <div class="mainContent">
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
    // 获取vuex中的属性 timeLineData时间线的数据
    ...mapState(["userMessage", "infos"]),
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
    // 底部内容区域
    .cardContent {
      font-size: 16px;
      .title {
        border-bottom: 1px solid #ccc;
        .items {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 16px;
          margin-bottom: 10px;
          .time {
            // width: 220px;
            .as {
              display: inline-block;
              color: #c0c0c0;
              padding: 5px 0px 5px 20px;
            }
          }
          .details {
            // 让其超出部分不显示
            cursor: pointer;
            // width: 320px;
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
      }
      // 底部内容区域
      .mainContent {
        cursor: pointer;
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
    }
    .showCardColor {
      background-color: #f5f5f5;
    }
  }
}
</style>
