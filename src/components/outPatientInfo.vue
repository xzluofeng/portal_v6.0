<template>
  <div class="outPatientInfo-wrap">
    <el-form :inline="true" :model="baseInfo" class="baseFilterInfo">
      <el-form-item label="就诊时间">
        <el-date-picker
          v-model="baseInfo.date"
          type="daterange"
          range-separator="至"
          unlink-panels
          value-format="yyyy-MM-dd"
          :picker-options="pickerBeginDateBefore"
        />
      </el-form-item>
      <!-- 第二个 就诊机构 -->
      <el-form-item label="就诊机构">
        <el-select v-model="baseInfo.institution" placeholder="请选择就诊机构">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <!-- 第三个 就诊科室 -->
      <el-form-item label="就诊科室">
        <el-select v-model="baseInfo.department" placeholder="请选择就诊科室">
          <el-option
            label="产科一病区"
            value="changke1"
          ></el-option>
          <el-option
            label="产科二病区"
            value="changke2"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 第四个 就诊类型 -->
      <el-form-item label="就诊类型">
        <el-select v-model="baseInfo.type" placeholder="请选择就诊类型">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "outPatientInfo",
  // 父子双向绑定的数据， baseInfo,并用它渲染
  props: {
    baseInfo: {
      required: true,
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      // 禁止时间
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },

  // 侦听器 将就诊信息的数据实时双向传给父组件
  watch: {
    baseInfo: {
      handler(val) {
        this.$emit("update:baseInfo", val);
      },
      // immediate: true,
      deep: true,
    },
  },

  // 方法
  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.outPatientInfo-wrap {
  padding-top: 15px;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  white-space: nowrap; //超出强制不换行
  height: 50px;
  background-color: #ffffff;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;

  .baseFilterInfo {
    ::v-deep.el-form-item {
      margin-right: 18px;
    }
    ::v-deep.el-input--medium {
      width: 360px;
    }
    ::v-deep.el-date-editor {
      width: 360px;
    }
    ::v-deep.el-form-item__label {
      font-weight: normal;
      color: black;
      font-size: 16px;
    }
  }
}
</style>
