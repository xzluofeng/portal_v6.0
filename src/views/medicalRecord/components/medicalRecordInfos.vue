<template>
  <!-- medicalRecordInfos面的的右下角报告的具体内容页面组件 todo..-->
  <div class="medicalRecordInfos-wrap">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="title">
        <el-button-group>
          <el-button type="primary"> 收藏 </el-button>
          <el-button type="primary" icon="el-icon-arrow-left" @click="prePage"
            >上一页</el-button
          >
          <el-button type="primary" @click="nextPage"
            >下一页<i class="el-icon-arrow-right" style="margin-left: 5px" />
          </el-button>
        </el-button-group>
        <!--<el-button style="margin-left: 20px;" type="primary" @click="printPdf">-->
        <!--打印-->
        <!--<i class="el-icon-printer" />-->
        <!--</el-button>-->
        <div class="pdf-page">({{ page }} / {{ pageTotal }})</div>
      </div>
      <!-- 内容区域 -->
      <div class="text item">
        <!--<iframe :src="'/pdf/' + this.pdfSrc" frameborder="0" type="application/x-google-chrome-pdf" style="width: 100%; height: 100%">-->
        <!--</iframe>-->
        <pdf
          ref="pdf"
          :src="'/pdf/' + pdfSrc"
          :page="page"
          @progress="loadedRatio = $event"
          @num-pages="pageTotal = $event"
        ></pdf>
      </div>
    </el-card>
  </div>
</template>

<script>
import pdf from "vue-pdf";
export default {
  name: "medicalRecordInfos",
  props: {
    pdfSrc: {
      type: String,
    },
  },
  components: { pdf },

  data() {
    return {
      page: 1,
      pageTotal: 1,
      loadedRatio: 0,
    };
  },

  watch: {
    pdfSrc: {
      handler: function (val, oldVal) {
        this.page = 1;
        this.getPdfPages(val);
      },
    },
    // 深度观察监听
    deep: true,
    immediate: true,
  },

  mounted() {},

  methods: {
    printPdf() {
      this.$refs.pdf.print();
    },

    // 翻页
    prePage() {
      let pageNum = this.page;
      pageNum = pageNum > 1 ? pageNum - 1 : this.pageTotal;
      this.page = pageNum;
    },
    nextPage() {
      let pageNum = this.page;
      pageNum = pageNum < this.pageTotal ? pageNum + 1 : 1;
      this.page = pageNum;
    },

    //  加载pdf
    getPdfPages(url) {
      const loadingTask = pdf.createLoadingTask("/pdf/" + url, {
        withCredentials: true,
      });
      loadingTask.promise
        .then((pdf) => {
          this.pageTotal = pdf.numPages || 1;
        })
        .catch((error) => {
          console.log("pdf加载失败", error);
        });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/styles/mixin.scss";
.medicalRecordInfos-wrap {
  .box-card {
    width: calc(100% - 55px);
    height: 685px;
    margin-left: 40px;
    font-size: 16px;
    .title {
      height: 60px;
      line-height: 60px;
      text-align: left;
      display: flex;
      //justify-content: space-between;
    }
    .pdf-page {
      position: absolute;
      right: 20px;
      width: 100px;
    }
    // 内容区域
    .item {
      height: 620px;
      overflow-y: auto;
      @include scrollBar;
      margin-bottom: 18px;
    }
  }
}
</style>
