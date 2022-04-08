<template>
  <div class="cardView-contianer">
    <!-- 第一栏 顶部logo栏 -->
    <div class="navBar">
      <div class="logo">
        <img src="@/assets/images/winning-logo.png" />
        <span>患者360</span>
      </div>
      <div class="logout">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <!-- 用户头像 -->
            <img src="@/assets/images/boy.png" class="user-avatar" />
            <span class="name">{{ loginInfo.userName }}</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <!-- 下拉显示区域 -->
            <el-dropdown-item divided>
              <span style="display: block">账户管理</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item divided>
              <span style="display: block">操作指南</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item divided>
              <span style="display: block">临时授权申请</span>
            </el-dropdown-item>
            <!-- 下拉显示区域 -->
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 第二栏 搜索 -->
    <div class="searcharea">
      <el-input
        class="elInput"
        v-model="input"
        placeholder="支持姓名/身份证号/手机号"
      />
      <el-button class="confimButton">
        <span>搜索 </span>
        <i class="toutiao toutiao-bianji"></i>
      </el-button>
      <!-- 右侧更多搜索按钮 -->
      <div class="moreSearchButton">
        <el-button class="cika">
          <span>磁卡 </span>
          <i class="toutiao toutiao-huiche"></i>
        </el-button>
        <el-button class="yibaoka">
          <span>医保卡 </span>
          <i class="toutiao toutiao-a-ditushouzhidianjichumo"></i>
        </el-button>
        <el-button class="idcard">
          <span>身份证 </span>
          <i class="toutiao toutiao-bianji"></i>
        </el-button>
      </div>
    </div>
    <!-- 标签页+机构选择 -->
    <div class="tabsArea">
      <div class="selectInstitutions">
        <el-select
          v-model="initSelectValue"
          placeholder="请选择"
          @change="drapSelectChangeFn"
        >
          <el-option
            v-for="item in DepartmentList"
            :key="item.departmentCode + item.departmentName"
            :label="`${item.departmentName}(${item.yljgmc})`"
            :value="item.departmentCode + '-' + item.yljgdm"
          />
        </el-select>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部患者" name="allPatient">
          <!-- 根据有无数据判断是显示卡片，还是显示空白页面 -->
          <div
            class="cardsArea"
            ref="cardsArea"
            v-if="cardsInfoList.length > 0"
          >
            <div
              class="singleCard"
              v-for="items in cardsInfoList"
              :key="items.index"
            >
              <el-card>
                <div class="card-top" @click="clickPatientCard(items)">
                  <div class="top-left">
                    <p :class="[items.sexname]"></p>
                    <p class="headerInfo">
                      <span class="sufferer-name">
                        {{ items.brxxkJz.hzxm }}
                      </span>
                      <span>|</span>
                      <span class="sex">{{ items.brxxkJz.xbmc }}</span>
                      <span>{{ items.patientAge }}</span>
                    </p>
                  </div>
                  <div class="top-right">
                    <p class="bed-num">{{ items.rycw }}床</p>
                    <p></p>
                    <p class="moreInfos">
                      <i :class="[items.showAllergy ? 'allergy' : '']"></i>
                      <i
                        :class="[
                          items.wzjbmc === '重危病人'
                            ? 'critical-pathological'
                            : '',
                        ]"
                      ></i>
                      <i :class="[items.showNursingLevel]"></i>
                      <i :class="[items.showSergery ? 'surgical' : '']"></i>
                    </p>
                  </div>
                </div>
                <div class="card-bottom">
                  <div class="bottom-left">
                    <p class="des">
                      {{ items.yexh === "0" ? items.mzzyzdmc : "" }}
                    </p>
                    <p class="doctor">
                      <span>主管医生：</span>
                      <span>{{ items.jzysmc }}</span>
                    </p>
                    <p class="days">
                      <span>入院天数：</span>
                      <span>{{ items.djsj }}</span>
                    </p>
                  </div>
                  <div class="bottom-right">
                    <!-- <p :class="[items.showFollowed ? 'followed' : 'group']" /> -->
                    <!-- 已关注的弹出框 -->
                    <el-popover
                      placement="bottom"
                      trigger="click"
                      :disabled="!items.showFollowed"
                      @show="showUnFocusedContent(items)"
                      @hide="hideUnFocusedContent(items)"
                    >
                      <span class="foucsedContent" v-show="showEditPage">
                        <div
                          class="cancelFollowCss"
                          @click="cancelFollowed(items)"
                        >
                          取消关注
                        </div>
                        <div
                          class="editGroupInfoCss"
                          @click.prevent="showEditPage = false"
                        >
                          编辑分组
                        </div>
                      </span>
                      <!-- 显示编辑的界面 -->
                      <span class="foucsedContent" v-show="!showEditPage">
                        <!-- 编辑的界面 ---开始 -->
                        <span class="foucsedContent">
                          <div class="top">
                            <span class="top-left">分组</span>
                            <span class="top-right">创建分组</span>
                          </div>
                          <p class="checkbox">
                            <el-checkbox-group v-model="checkList">
                              <el-checkbox
                                v-for="parts in focusedContent"
                                :key="parts.id"
                                :label="parts.id"
                                >{{ parts.groupName }}</el-checkbox
                              >
                            </el-checkbox-group>
                          </p>
                          <div class="bottom">
                            <el-button size="mini" @click="unfocusCancelBtn()">
                              取消
                            </el-button>
                            <el-button
                              type="primary"
                              size="mini"
                              @click="unfoucsConfirmBtn(items)"
                            >
                              确定
                            </el-button>
                          </div>
                        </span>
                        <!-- 编辑的界面 ---结束 -->
                      </span>
                      <div
                        @click.prevent="showEditPage = true"
                        v-show="items.showFollowed"
                        :class="[items.showFollowed ? 'followed' : 'group']"
                        slot="reference"
                      />
                    </el-popover>
                    <!-- 未关注的弹出框 -->
                    <el-popover
                      width="200"
                      placement="bottom"
                      trigger="click"
                      :disabled="items.showFollowed"
                      @show="showUnFocusedContent(items)"
                      @hide="hideUnFocusedContent(items)"
                    >
                      <!-- 编辑的界面 ---开始 -->
                      <span class="foucsedContent">
                        <div class="top">
                          <span class="top-left">分组</span>
                          <span class="top-right">创建分组</span>
                        </div>
                        <p class="checkbox">
                          <el-checkbox-group v-model="checkList">
                            <el-checkbox
                              v-for="parts in focusedContent"
                              :key="parts.id"
                              :label="parts.id"
                              >{{ parts.groupName }}</el-checkbox
                            >
                          </el-checkbox-group>
                        </p>
                        <div class="bottom">
                          <el-button size="mini" @click="unfocusCancelBtn()">
                            取消
                          </el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            @click="unfoucsConfirmBtn(items)"
                          >
                            确定
                          </el-button>
                        </div>
                      </span>
                      <!-- 编辑的界面 ---结束 -->
                      <div
                        v-show="!items.showFollowed"
                        :class="[items.showFollowed ? 'followed' : 'group']"
                        slot="reference"
                      />
                    </el-popover>
                  </div>
                </div>
              </el-card>
            </div>
            <!-- 空标签作为flex布局补位用 -->
            <i></i><i></i><i></i><i></i>
          </div>
          <!-- 没有数据显示无数据图片 -->
          <div v-else class="showNodata" />
        </el-tab-pane>
        <el-tab-pane label="我的患者" name="myPatient">
          <!-- 根据有无数据判断是显示卡片，还是显示空白页面 -->
          <!-- todo... 如果有数据。。。 -->
          <div
            class="showMyPatientNoData"
            v-if="this.myPatientList.length <= 0"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex"; // 方法2
import { formatCardInfo } from "@/utils/tools.js";
export default {
  name: "cardView",
  data() {
    return {
      loginInfo: {}, // 登录信息
      input: "", // searcharea输入框内容
      activeName: "allPatient", // 标签页激活的名称
      initSelectValue: "", // 初始选择第一个输入框内容
      departmentCode: "", // 当前的部门代码
      yljgdm: "", // 当前的部门机构代码
      DepartmentList: [], // 部门列表
      cardsInfoList: [], // 卡片信息详情列表
      showEditPage: true, // 是否显示编辑界面
      checkList: [], // 选中的复选框内容
      focusedContent: [], // 显示分组的信息
      patientContent: [], // 显示复选框已经关注的列表
      myPatientList: [], // 切换tabs后的我的患者
    };
  },
  // computed: {
  //   ...mapState({ userMessage: "userMessage" }), // 方法2
  // },
  mounted() {
    this.getDepartmentList();
    // 拿到用户登录的信息
    this.loginInfo = this.$storage.get("vuex").userMessage;
  },
  methods: {
    // 点击退出登录 重置vuex数据
    logout() {
      this.$store.commit("Logout");
      this.$router.push({ path: "/login" });
    },
    // 选择分页事件
    handleClick(tab, event) {
      if (tab.label === "我的患者") {
        const params = {
          ksdm: this.departmentCode,
          yljgdm: this.yljgdm,
        };
        return new Promise((resolve, reject) => {
          this.$api.getZyjzlistByUsercode(params).then((res) => {
            // 切换tabs后的我的患者
            this.myPatientList = res.data;
          });
        });
      }
    },
    // 获取部门列表
    getDepartmentList() {
      return new Promise((resolve, reject) => {
        this.$api.getAllDepartmentList().then((res) => {
          const list = res.data;
          this.DepartmentList = list;
          this.initSelectValue = `${list[0].departmentName}(${list[0].yljgmc})`;
          //  第一次渲染数据的一个数组项机构
          this.departmentCode = list[0].departmentCode;
          this.yljgdm = list[0].yljgdm;
          // 拿到数据后调其余的接口
          this.getcardsInfo();
        });
      });
    },
    // 获取卡片信息
    getcardsInfo() {
      const params = {
        ksdm: this.departmentCode,
        yljgdm: this.yljgdm,
      };
      return new Promise((resolve, reject) => {
        this.$api.getZyjzlistByKsdm(params).then((res) => {
          // 格式化数据(引入自tools)
          const formatDatas = formatCardInfo(res.data);
          this.cardsInfoList = formatDatas;
          // 通过卡片信息数据调(手术、过敏信息)
          const arrParams = [];
          formatDatas.forEach((items) => {
            const coreInfo = {
              patid: items.patid,
              jzlsh: items.jzlsh,
              jzlb: items.jzlb,
              yljgdm: items.yljgdm,
              yexh: items.yexh,
              brzt: items.brzt,
            };
            arrParams.push(coreInfo);
          });
          // 调手术信息
          this.renderSsInfo(JSON.stringify(arrParams));
          // 调过敏信息接口
          this.renderPsjgInfo(JSON.stringify(arrParams));
          // 调分组信息接口
          this.renderGroupInfo(JSON.stringify(arrParams));
        });
      });
    },
    // 下拉框改变时候重新调接口
    drapSelectChangeFn() {
      // 选下拉框后就需要选中的value中的departmentCode和yljgdm重新调接口
      this.departmentCode = this.initSelectValue.substr(
        0,
        this.initSelectValue.indexOf("-")
      );
      this.yljgdm = this.initSelectValue.substr(
        this.initSelectValue.indexOf("-") + 1,
        this.initSelectValue.length
      );
      this.getcardsInfo();
      // 原逻辑切换tabs先回到全部患者tab页
      this.activeName = "allPatient";
    },
    // 渲染手术信息的接口
    renderSsInfo(params) {
      return new Promise((resolve, reject) => {
        this.$api.getSsbzByJzlshList({ jzdjCoreInfos: params }).then((res) => {
          if (res.data && res.data.length > 0) {
            const arrSergery = [];
            res.data.forEach((items) => {
              arrSergery.push(items.jzlsh);
            });
            // 给卡片数据添加是否显示手术的属性
            this.cardsInfoList.forEach((item) => {
              if (arrSergery.includes(item.brxxkJz.jzlsh)) {
                // vue2不允许在已创建的实例上添加新的根级响应式属性
                // item.showSergery = "true";
                this.$set(item, "showSergery", true);
              }
            });
          }
        });
      });
    },
    // 渲染过敏信息的接口
    renderPsjgInfo(params) {
      return new Promise((resolve, reject) => {
        this.$api.getPsjgByJzlshList({ jzdjCoreInfos: params }).then((res) => {
          if (res.data && res.data.length > 0) {
            const arrAllergy = [];
            res.data.forEach((items) => {
              items.psjg && arrAllergy.push(items.jzlsh);
            });
            // 给卡片数据添加是否显示过敏的属性
            this.cardsInfoList.forEach((item) => {
              if (arrAllergy.includes(item.brxxkJz.jzlsh)) {
                this.$set(item, "showAllergy", true);
              }
            });
          }
        });
      });
    },
    // 渲染分组信息的接口
    renderGroupInfo(params) {
      return new Promise((resolve, reject) => {
        this.$api.getFzbzByJzlshList({ jzdjCoreInfos: params }).then((res) => {
          if (res.data && res.data.length > 0) {
            const arrGroupInfo = [];
            res.data.forEach((items) => {
              arrGroupInfo.push(items.jzlsh + "-" + items.yexh);
            });
            // 给卡片渲染是否关注的样式
            this.cardsInfoList.forEach((item) => {
              if (arrGroupInfo.includes(item.brxxkJz.jzlsh + "-" + item.yexh)) {
                this.$set(item, "showFollowed", true);
              }
            });
          }
        });
      });
    },
    //  关注过的卡片经过关注图标后点击取消关注后的事件
    async cancelFollowed(datas) {
      // 1.调接口取消关注
      const paramas = {
        patid: datas.brxxkJz.patid,
        jzlb: datas.brxxkJz.jzlb,
        yljgdm: datas.brxxkJz.yljgdm,
      };
      // 连续调两个接口才能取消关注
      const { data: res } = await this.$api.queryPatient(paramas);
      await this.$api.deletePatientGroup({ patidList: res, yexh: datas.yexh });
      // 2.关闭弹出框显示
      this.$message({
        message: "取消关注成功",
        type: "success",
        duration: 2000,
      });
      // 3.卡片上显示取消关注
      this.$set(datas, "showFollowed", false);
      // 4.清空this.checkList
      this.checkList = [];
    },

    // 没关注过的取消事件
    unfocusCancelBtn() {
      document.querySelector("#app").click();
      this.checkList = [];
    },

    // 获取关注护理分组列表
    async showUnFocusedContent(data) {
      try {
        // 调已关注的列表
        const param = {
          patidList:
            data.brxxkJz.patid +
            "+" +
            data.brxxkJz.jzlb +
            "+" +
            data.brxxkJz.yljgdm,
          yexh: data.yexh,
        };
        const { data: hasPatientRes } = await this.$api.getPatientGroup(param);
        this.patientContent = Object.assign({}, hasPatientRes);
        // 要把已经关注过的push进去现在的checkbox视图层
        hasPatientRes.forEach((items) => {
          this.checkList.push(items.groupId);
        });
        // 调渲染关注列表
        const params = {
          patidGuid:
            data.brxxkJz.jzlsh +
            "+" +
            data.brxxkJz.jzlb +
            "+" +
            data.brxxkJz.yljgdm,
        };
        const { data: res } = await this.$api.getEnableUserGroup(params);
        this.focusedContent = Object.assign({}, res);
      } catch (error) {
        console.log(error);
      }
    },

    // 隐藏时候
    hideUnFocusedContent(data) {
      // 消除了BUG
      this.checkList = [];
    },
    // 没关注过的卡片点击确认后更新关注
    async unfoucsConfirmBtn(data) {
      // 1.调接口取消关注
      const paramas = {
        patid: data.brxxkJz.patid,
        jzlb: data.brxxkJz.jzlb,
        yljgdm: data.brxxkJz.yljgdm,
      };
      // 如果否选了复选框才去更新，没勾复选框直接退出
      if (this.checkList.length > 0) {
        try {
          // 连续调两个接口才能关注
          const { data: res } = await this.$api.queryPatient(paramas);
          // 需要把this.checkList的内容作为参数调更新视图接口
          const jzlshList = [];
          this.checkList.forEach((item) => {
            jzlshList.push({
              groupId: item,
              yexh: data.yexh,
              jzlshGuid: data.jzlshGuid,
            });
          });
          await this.$api.updatePatidGroup({
            patidList: res,
            jzlshGroupList: JSON.stringify(jzlshList),
          });
          // 更新成功后视图要重新刷新
          // 2.关闭弹出框显示
          this.$message({
            message: "关注成功",
            type: "success",
            duration: 2000,
          });
          // 3.卡片上显示关注
          this.$set(data, "showFollowed", true);
          // 4. 清空checklist
          this.checkList = [];
          // 5. 关闭卡片
          document.querySelector("#app").click();
        } catch (error) {
          console.log(error);
        }
      } else {
        // 没勾选复选框就关闭弹出框显示
        this.checkList = [];
        document.querySelector("#app").click();
      }
    },

    // 点击卡片的事件 todo...跳转到home页面
    async clickPatientCard(data) {
      // 还要调用两个接口，拿到数据存入vuex持久化
      try {
        var params = {
          jzlsh: data.jzlsh,
          jzlb: data.jzlb,
          yljgdm: data.yljgdm,
          yexh: data.yexh,
        };
        const { data: res } = await this.$api.getPatientByJzlsh(params);
        // 存入vuex持久化
        this.$store.commit("SET_Infos", res);
      } catch (error) {
        console.log(error);
      }
      // 调用EMPI参数设置
      try {
        const parameter = {
          patid: data.brxxkJz.patid,
          jzlb: data.brxxkJz.jzlb,
          yljgdm: data.brxxkJz.yljgdm,
        };
        const { data: resEMPI } = await this.$api.queryPatient(parameter);
        // 存入vuex持久化
        this.$store.commit("SET_OriginalPatids", resEMPI);
        this.$router.push({ path: "/inspectReport" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@import "../../styles/mixin.scss";
.cardView-contianer {
  font-size: 12px;
  height: 100vh;
  overflow: hidden;
  background-color: #edeef0;
  .navBar {
    position: relative;
    z-index: 9999;
    width: 100%;
    min-height: 50px;
    background-color: #2d5afb;
    display: flex;
    justify-content: space-between;
    .logo {
      padding-left: 23px;
      img {
        margin-top: 6px;
      }
      span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        padding-left: 16px;
        font-size: 19px;
        color: #eaeefe;
      }
    }
    // 右侧头像
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        transform: translateY(50%);
        position: relative;
        // 用户头像
        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 25px;
          vertical-align: middle;
        }
        // 名字
        .name {
          color: #fff;
          cursor: pointer;
          margin-left: 10px;
          font-size: 16px;
          vertical-align: middle;
        }
      }
    }
  }
  // 搜索区域
  .searcharea {
    display: flex;
    padding: 15px 120px;
    background-color: #eef2fd;
    width: 100%;
    .elInput {
      margin-top: 8px;
      width: 400px;
    }
    .confimButton {
      min-width: 100px;
      line-height: 12px;
      margin-top: 8px;
      transform: translateX(-100px);
      border: unset;
      border-radius: 0px 4px 4px 0px;
      background-color: #2d5afb;
      color: #dde4fe;
    }
    .moreSearchButton {
      transform: translateX(-80px);
      .cika,
      .yibaoka,
      .idcard {
        min-width: 100px;
        line-height: 12px;
        margin-top: 8px;
        margin-right: 8px;
        span {
          font-size: 16px;
          color: black;
        }
      }
    }
  }
  // 顶部标签页区域
  .tabsArea {
    font-size: 16px;
    padding: 15px 120px;
    background-color: #edeef0;
    .selectInstitutions {
      position: relative;
      z-index: 999;
      float: left;
      ::v-deep.el-select {
        width: 300px;
        .el-input__inner {
          // 默认选中的下拉框文字
          font-size: 16px;
          border-radius: 0px;
          height: 40px;
          line-height: 40px;
        }
      }
    }
    ::v-deep.el-tabs__nav {
      left: 40.5%;
      transform: translateX(-60%) !important;
    }
    // 无数据显示的显示图片
    .showNodata {
      min-height: 680px;
      margin: 0px auto;
      background: url(~@/assets/images/empty.png) center center no-repeat scroll
        #fafdff;
    }
    .showMyPatientNoData {
      min-height: 680px;
      margin: 0px auto;
      background: url(~@/assets/images/mysuffererEmpty.png) center center
        no-repeat scroll #fafdff;
    }
  }

  // 卡片区域
  .cardsArea {
    height: calc(100vh - 190px);
    overflow-y: auto;
    // @include scrollBarForCardview;

    min-height: 531px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // 滚动条
    &::-webkit-scrollbar {
      width: 0px;
      height: 10px;
      background-color: #ccc;
    }
    /deep/.el-card {
      border: 1px solid #ccc;
      &:hover {
        border: 1px solid #79a2fa;
      }
    }
    .singleCard,
    i {
      width: 24%;
      margin-bottom: 13px;
    }

    // 卡片的头部区域
    .card-top {
      border-bottom: 1px dashed #ccc;
      padding-bottom: 0px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      .top-left {
        .woman {
          background: url(~@/assets/images/girl.png) center center no-repeat;
          background-size: contain;
          width: 60px;
          height: 60px;
        }
        .man {
          background: url(~@/assets/images/boy.png) center center no-repeat;
          background-size: contain;
          width: 60px;
          height: 60px;
        }
        .baby-girl {
          background: url(~@/assets/images/baby-girl.png) center center
            no-repeat;
          background-size: contain;
          width: 60px;
          height: 60px;
        }
        .baby-boy {
          background: url(~@/assets/images/baby-boy.png) center center no-repeat;
          background-size: contain;
          width: 60px;
          height: 60px;
        }
        .old-man {
          background: url(~@/assets/images/old-man.png) center center no-repeat;
          background-size: contain;
          width: 60px;
          height: 60px;
        }
        .old-woman {
          background: url(~@/assets/images/old-woman.png) center center
            no-repeat;
          background-size: contain;
          width: 60px;
          height: 60px;
        }
        .headerInfo {
          span {
            margin-right: 5px;
            vertical-align: middle;
            font-size: 14px;
          }
          .sufferer-name {
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
      .top-right {
        .bed-num {
          font-size: 18px;
          font-weight: bold;
        }
        .moreInfos {
          width: 100%;
          text-align: right;
          display: block;
          height: 35px;
          line-height: 35px;
          margin-top: 42px;
          // 动态样式源自于tools.js
          .tjhl,
          .yjhl,
          .ejhl,
          .sjhl,
          .critical-pathological,
          .allergy,
          .surgical {
            width: 24px;
            height: 24px;
            margin-left: 8px;
            display: inline-block;
          }
          .allergy {
            background: url(~@/assets/images/cardAllergy.png) center center
              no-repeat;
          }
          .tjhl {
            background: url(~@/assets/images/tjhl.png) center center no-repeat;
          }
          .yjhl {
            background: url(~@/assets/images/yjhl.png) center center no-repeat;
          }
          .ejhl {
            background: url(~@/assets/images/ejhl.png) center center no-repeat;
          }
          .sjhl {
            background: url(~@/assets/images/sjhl.png) center center no-repeat;
          }
          .critical-pathological {
            background: url(~@/assets/images/bz.png) center center no-repeat;
          }
          .surgical {
            background: url(~@/assets/images/surgical.png) center center
              no-repeat;
          }
        }
      }
    }
    // 卡片的底部区域
    .card-bottom {
      width: 100%;
      padding-bottom: 15px;
      display: flex;
      justify-content: space-between;
      .bottom-left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        p {
          margin: 5px;
        }
        p:nth-child(1) {
          margin-top: 20px;
        }
        .des::before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          width: 14px;
          height: 14px;
          background: url(~@/assets/images/star.png) center center no-repeat;
          background-size: contain;
          margin-right: 10px;
        }
        .doctor::before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          width: 14px;
          height: 14px;
          background: url(~@/assets/images/doctor.png) center center no-repeat;
          background-size: contain;
          margin-right: 10px;
        }
        .days::before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          width: 14px;
          height: 14px;
          background: url(~@/assets/images/date.png) center center no-repeat;
          background-size: contain;
          margin-right: 10px;
        }
      }
      .bottom-right {
        display: flex;
        align-items: flex-end;
        cursor: pointer;
        .group {
          width: 25px;
          height: 25px;
          background: url(~@/assets/images/collect.png) center center no-repeat;
          background-size: contain;
        }
        .followed {
          width: 25px;
          height: 25px;
          background: url(~@/assets/images/alrcollect.png) center center
            no-repeat;
          background-size: contain;
        }
      }
    }
  }
}
</style>
