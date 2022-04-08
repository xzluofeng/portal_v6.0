<template>
  <div class="home-container">
    <!-- 就诊筛选区域 -->
    <OutPatientInfo :baseInfo.sync="homeDataInfo.treatMentData" />
    <!-- 表单区域 -->
    <div class="filterArea">
      <el-form :inline="true" :model="homeDataInfo" class="moreFilterInfo">
        <el-form-item label="接诊医生">
          <el-select v-model="homeDataInfo.doctor" placeholder="请选择接诊医生">
            <el-option label="医生1" value="1"></el-option>
            <el-option label="医生2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" class="button">
            提交
          </el-button>
          <el-button @click="resetForm" class="button"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部人体部位展示区域 -->
    <div class="bodyArea">
      <div class="human">
        <img src="@/assets/images/rtst-man.png" />
      </div>
      <div class="bodyArea-top"></div>
      <div class="bodyArea-bottom">
        <img src="@/assets/images/shadow.png" />
      </div>
    </div>
  </div>
</template>

<script>
import OutPatientInfo from "@/components/outPatientInfo.vue"; // 搜索框组件
import { removeWatermark, setWaterMark } from "@/utils/watermark";
import { mapState } from "vuex";
export default {
  name: "home",
  components: {
    OutPatientInfo,
  },
  data() {
    return {
      homeDataInfo: {
        doctor: "", // 接诊医生
        // 传给子组件渲染就诊数据的（通过.sync双向绑定了）
        treatMentData: {
          date: [
            this.$moment(new Date()).format("YYYY-MM-DD"),
            this.$moment(new Date()).add(1, "day").format("YYYY-MM-DD"),
          ], // 就诊日期
          institution: "", // 就诊机构
          department: "", // 就诊科室
          type: "", // 就诊类型
        },
      },
      // watermarkTxt: "姓名+工号+科室+IP",
    };
  },
  computed: {
    // 获取vuex中的属性
    ...mapState(["userMessage", "infos"]),
  },
  mounted() {
    this.initHomeData();
    // 开启水印
    setWaterMark(
      this.userMessage.fullname +
        " " +
        this.userMessage.usercode +
        " " +
        this.userMessage.ipAddress,
      ""
    );
  },
  destroyed() {
    // 页面销毁的时候取消水印
    removeWatermark();
  },

  /**
   * 方法部分
   * **/
  methods: {
    // 初始渲染数据
    initHomeData() {},
    // 提交数据
    submitForm() {
      console.log(this.homeDataInfo);
    },
    // 重置数据
    resetForm() {
      this.homeDataInfo = {
        doctor: "",
        treatMentData: {
          // 选中当前日期
          date: [
            this.$moment(new Date()).format("YYYY-MM-DD"),
            this.$moment(new Date()).add(1, "day").format("YYYY-MM-DD"),
          ], // 就诊日期
          institution: "", // 就诊机构
          department: "", // 就诊科室
          type: "", // 就诊类型
        },
      };
    },
    // 子组件传来的数据
    // trementDataFromSon(val) {
    //   this.treatMentData = val;
    // },
  },
};
</script>

<style lang='scss' scoped>
.home-container {
  .filterArea {
    width: 100%;
    height: 65px;
    display: flex;
    padding-top: 15px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    ::v-deep.el-form-item__label {
      font-weight: normal;
      color: black;
      font-size: 16px;
    }
    ::v-deep.el-input--medium {
      width: 360px;
    }
    .button {
      margin-left: 8px;
    }
  }
  .bodyArea {
    position: relative;
    background-size: 200px 100px;
    .bodyArea-top {
      width: 100%;
      height: 600px;
      background: linear-gradient(to bottom, #0223b0, #001b89);
    }
    .bodyArea-bottom {
      width: 100%;
      height: 150px;
      background: linear-gradient(to bottom, #0f32a5, #5074ef);
      img {
        width: 800px;
        margin-left: 50%;
        transform: translate(-50%, -180px);
        opacity: 0.6;
        height: 330px;
      }
    }
    .human {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 60px;
      img {
        width: 321px;
        height: 624px;
      }
    }
  }
}
</style>
