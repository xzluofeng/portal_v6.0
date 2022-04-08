<!--
 * @Author: Jason Liu
 * @Date: 2022-03-17 10:38:50
 * @Desc:
-->
<template>
  <el-container :class="['theme_preview', theme]">
    <el-header class="header">
      <div class="winning_loge">
        <img src="../assets/images/win-logo.svg" />
      </div>
      <div class="system_name">患者360</div>
    </el-header>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="4" class="h1 text_rigth"></el-col>
          <el-col :span="20" class="h1 text_left">
            主题：
            <el-radio-group v-model="theme">
              <template v-for="(item, i) in themes_list">
                <el-radio-button
                  :label="item.calssName"
                  :value="item.calssName"
                  :key="i"
                >
                  {{ item.name }}
                </el-radio-button>
              </template>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-card class="preview_card">
          <div slot="header">
            Color 色彩<span class="desc"
              >使用一套特定的调色板来规定颜色，为你所搭建的产品提供一致的外观视觉感受。</span
            >
          </div>
          <div class="color_card mainColor">
            <div class="color_item secondaryColor"></div>
            <div class="color_item pressColor"></div>
            <div class="color_item headerColor"></div>
            <div class="color_item checkedColor"></div>
            <div class="color_item navigationColor"></div>
          </div>
        </el-card>

        <p class="preview_card h1">Button 按钮</p>
        <el-card class="preview_card">
          <div slot="header">基础用法</div>
          <el-row class="demo_line">
            <el-button>默认按钮</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
            <el-button type="danger">危险按钮</el-button>
          </el-row>

          <el-row class="demo_line">
            <el-button plain>朴素按钮</el-button>
            <el-button type="primary" plain>主要按钮</el-button>
            <el-button type="success" plain>成功按钮</el-button>
            <el-button type="info" plain>信息按钮</el-button>
            <el-button type="warning" plain>警告按钮</el-button>
            <el-button type="danger" plain>危险按钮</el-button>
          </el-row>

          <el-row class="demo_line">
            <el-button round>圆角按钮</el-button>
            <el-button type="primary" round>主要按钮</el-button>
            <el-button type="success" round>成功按钮</el-button>
            <el-button type="info" round>信息按钮</el-button>
            <el-button type="warning" round>警告按钮</el-button>
            <el-button type="danger" round>危险按钮</el-button>
          </el-row>

          <el-row class="demo_line">
            <el-button icon="el-icon-search" circle></el-button>
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="success" icon="el-icon-check" circle></el-button>
            <el-button type="info" icon="el-icon-message" circle></el-button>
            <el-button
              type="warning"
              icon="el-icon-star-off"
              circle
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
const themes = require("./index").default;
export default {
  computed: {
    themes_list() {
      return themes.themes_list;
    },
  },
  data() {
    return {
      theme: "winning_60",
    };
  },
};
</script>

<style lang="scss" scoped>
.theme_preview {
  .header {
    height: 54px !important;
  }
  height: 100vh;
  .text_rigth {
    text-align: right;
  }

  .text_left {
    text-align: left;
  }

  .preview_card {
    margin-top: 20px;
    text-align: left;
    .desc {
      margin-left: 14px;
      font-size: 20px;
      color: #666666;
    }
  }

  .color_card {
    width: 750px;
    height: 300px;
    display: flex;
    flex-wrap: wrap-reverse;
    .color_item {
      float: left;
      width: 150px;
      height: 150px;
    }
  }

  .demo_line {
    margin: 15px 0;
  }
}
</style>
