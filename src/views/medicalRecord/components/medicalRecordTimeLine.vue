<template>
  <!-- medicalRecord页面的的左下时间线页面组件 -->
  <div class="medicalRecord-wrap">
    <!-- 头部我的收藏 -->
    <div class="chooseMyCollect">
      <el-radio-group v-model="allCollect">
        <el-radio-button label="allCollect">全部</el-radio-button>
        <el-radio-button label="myCollect">我的收藏</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 时间线 -->
    <div class="timelineContent">
      <el-timeline>
        <el-timeline-item v-for="item in lisreportEntityList" :key="item.id">
          <div class="items">
            <div class="time">
              <div class="startTime">{{ item.startTime }}</div>
              <!-- 做v-if判断是否有截止时间 -->
              <template v-if="item.endTime && item.encounterTypeNo !== '1'">
                <span class="as">至</span>
                <div class="endTime">{{ item.endTime }}</div>
              </template>
            </div>
            <div class="details">
              <span class="tags">{{ item.zylx }}</span>
              <span class="illnessType">【{{ item.jcks }}】</span>
              <span class="institution">{{ item.jcjg }}</span>
              <span class="locations">{{ item.jcwz }}</span>
            </div>
          </div>
          <!-- 内容 树控件 -->
          <el-card class="cardContent">
            <div class="title">
              <p>
                <span>
                  <span class="circle">{{ item.circle }}</span>
                  <span class="ills">{{ item.ills }}</span>
                </span>
                <span>{{ item.jcys }}</span>
              </p>
            </div>
            <div class="mainContent">
              <!-- 可能多条 v-for渲染 -->
              <!-- 树形控件 -->
              <el-tree
                :data="item.contents"
                :props="defaultProps"
                @node-click="handleNodeClick"
                accordion
                node-key="id"
                default-expand-all
              >
                <!-- 使用 scoped slot 会传入两个参数node和data，
                分别表示当前节点的 Node 对象和当前节点的数据。 -->
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <i :class="data.icon"></i>
                  <span class="treeData">{{ data.title }}</span>
                  <span class="treeData">{{ data.date }}</span>
                  <span class="treeData"> {{ data.details }}</span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
export default {
  name: "medicalRecordTimeLine",
  data() {
    return {
      treeExpandDatas: [],
      // 时间线上面的左右切换滑块
      allCollect: "allCollect",
      // 要渲染的数据,看是否从父组件传过来
      lisreportEntityList: [
        {
          id: 213124,
          startTime: "2022-01-25",
          endTime: "",
          zylx: "住院",
          jcks: "五官科",
          jcjg: "佛山禅医",
          jcwz: "",
          circle: "主",
          ills: "双侧感音神经性听觉丧失（中度）",
          jcys: "何姗姗",
          contents: [
            {
              id: 1,
              title: "入院记录",
              children: [
                {
                  id: 1,
                  date: "2022-01-25 09:15:20",
                  details: "成人患者入院评估单(新)",
                  src: "3000000180__2__成人患者入院评估单(新)__714571864.pdf",
                },
              ],
            },
            {
              id: 2,
              title: "病程记录",
              children: [
                {
                  id: 1,
                  date: "2022-01-25 09:22:30",
                  details: "住院成人患者首次疼痛评估单",
                  src: "3000000180__2__住院成人患者首次疼痛评估单__714571750.pdf",
                },
                {
                  id: 2,
                  date: "2022-01-25 09:22:59",
                  details: "基本生活能力(BADL)量表",
                  src: "3000000180__2__基本生活能力(BADL)量表__714571716.pdf",
                },
                {
                  id: 3,
                  date: "2022-01-25 09:23:48",
                  details: "年老体弱评估表",
                  src: "3000000180__2__年老体弱评估表__714571859.pdf",
                },
                {
                  id: 4,
                  date: "2022-01-26 10:32:28",
                  details: "外科深静脉血栓风险评估单",
                  src: "3000000180__2__外科深静脉血栓风险评估单__714571615.pdf",
                },
                {
                  id: 5,
                  date: "2022-01-28 10:07:30",
                  details: "住院患者成人Morse跌倒评估量表",
                  src: "3000000180__2__住院患者成人Morse跌倒评估量表__714571682.pdf",
                },
                {
                  id: 6,
                  date: "2022-01-29 10:15:07",
                  details: "住院成人患者后续疼痛评估单",
                  src: "3000000180__2__住院成人患者后续疼痛评估单__714571781.pdf",
                },
              ],
            },
          ],
        },
      ],
      // 树形控件改名要用的属性
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  watch: {},
  mounted() {
    // 给tree结构的数据添加一条icon的属性，渲染icon
    this.lisreportEntityList.forEach((item) => {
      item.contents.forEach((items) => {
        this.$set(items, "icon", "el-icon-s-order");
      });
    });
    this.handleNodeClick(this.lisreportEntityList[0].contents[0].children[0]);
  },
  methods: {
    // 点击树形节点时间
    handleNodeClick(data) {
      if (data && data.src) {
        this.$emit("returnSrc", data.src);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.medicalRecord-wrap {
  margin-top: 10px;
  .chooseMyCollect {
    display: flex;
    padding-left: 40px;
    margin-bottom: 20px;
  }
  .timelineContent {
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
        cursor: pointer;
        font-size: 16px !important;
        padding: 10px 5px;
        p {
          padding: 10px;
          .contents {
            margin-left: 15px;
          }
          .error {
            vertical-align: middle;
            color: red;
          }
        }
        .treeData {
          margin-left: 10px;
        }
      }
      // ::v-deep.el-card__body {
      //   padding: 0px;
      // }
    }
  }
}
</style>
