<template>
  <div class="patient_view_container">
    <el-row>
      <el-radio-group v-model="suffererType">
        <el-radio-button label="1">全部患者</el-radio-button>
        <el-radio-button label="2">我的患者</el-radio-button>
      </el-radio-group>
      <el-select
        class="query_area"
        v-model="initSelectValue"
        placeholder="请选择病区"
        @change="drapSelectChangeFn"
      >
        <el-option
          v-for="item in DepartmentList"
          :key="item.departmentCode + item.departmentName"
          :label="`${item.departmentName}(${item.yljgmc})`"
          :value="item.departmentCode + '-' + item.yljgdm"
        >
        </el-option>
      </el-select>
      <div class="query_key">
        <el-input
          v-model="query_key"
          placeholder="支持姓名/身份证/病历号/院内卡号/医保卡号/联系电话"
          @change="loadTableInfo"
          :clearable="true"
        />
      </div>
      <el-popover
        placement="bottom"
        width="1100"
        trigger="click"
        ref="pop"
        :disabled="showPop"
      >
        <el-table :data="searchDataList" @row-click="clickData">
          <el-table-column width="100" label="住院/门诊" align="center">
            <template slot-scope="scope">
              {{
                scope.row.encounterTypeNo === "4"
                  ? scope.row.imrn
                  : scope.row.omrn
              }}
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            property="fullName"
            label="患者姓名"
            align="center"
          ></el-table-column>
          <el-table-column
            width="80"
            property="genderName"
            label="性别"
            align="center"
          ></el-table-column>
          <el-table-column
            width="100"
            property="birthDate"
            label="出生日期"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            width="100"
            property="inDeptName"
            label="就诊科室"
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            width="100"
            label="最后就诊"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.visitEndTime ? scope.row.visitEndTime : "--" }}
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            property="idcardNo"
            label="证件号"
            align="center"
          ></el-table-column>
          <el-table-column min-width="100" label="电话" align="center">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.bizRoleTelecom.length > 0
                    ? scope.row.bizRoleTelecom[0].contactNo
                    : "--"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            label="地址"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.bizRoleAddress.length > 0
                    ? scope.row.bizRoleAddress[0].addrDetail
                    : "--"
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" slot="reference" @click="loadTableInfo"
          >高级搜索</el-button
        >
      </el-popover>
    </el-row>

    <div class="sufferer_list" v-loading="loading">
      <template v-for="(item, i) in cardsInfoList">
        <div class="sufferer_card" :key="i">
          <div class="sufferer_user" @click="clickPatientCard(item)">
            <img
              :src="item.genderName === '男' ? iconMan : iconWoman"
              class="user-avatar"
            />
            <!-- <img :src="iconMan" class="user-avatar" /> -->
            <p class="text_bed">{{ item.bedNo || "-" }}<span>床</span></p>
            <p class="text_user">
              {{ item.fullName || "-" }}
              <i class="sep_line" />
              <span>{{ (item.ageYear || "-") + "岁" }}</span>
              <img
                :src="item.genderName === '男' ? iMan : iWoman"
                class="i_sex"
              />
              <!-- <img :src="iMan" class="i_sex" /> -->
            </p>
            <div class="sufferer_symptom">
              <span class="text_symptom" v-if="item.showAllergy">敏</span>
              <span class="text_rating_1" v-if="item.severityLevelCode === 1"
                >I</span
              >
              <span class="text_rating_2" v-if="item.severityLevelCode === 2"
                >II</span
              >
              <span class="text_rating_3" v-if="item.severityLevelCode === 3"
                >III</span
              >
            </div>
          </div>
          <div class="sufferer_illness">
            <p class="sufferer_illness_detail">
              <img
                src="@/assets/images/icon_info_illness.svg"
                class="info-avatar"
              />
              病情诊断<span>{{
                item.yexh || "0" === "0" ? item.diagnosisName : ""
              }}</span>
            </p>
            <p class="sufferer_illness_detail">
              <img
                src="@/assets/images/icon_info_user.svg"
                class="info-avatar"
              />
              主管医生<span>{{ item.scheduledDoctorName || "-" }}</span>
            </p>
            <p class="sufferer_illness_detail">
              <img
                src="@/assets/images/icon_info_date.svg"
                class="info-avatar"
              />
              入院天数<span>{{ (item.inHospitalDays || "-") + "天" }}</span>
            </p>
            <div class="sufferer_focus">
              <!--              <img src="@/assets/images/icon_focus.svg" class="i_icon" />-->
              <i class="el-icon-star-off i_icon" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const man = require("@/assets/images/icon_man.svg");
const woman = require("@/assets/images/icon_woman.svg");
const iMan = require("@/assets/images/i_man.svg");
const iWoman = require("@/assets/images/i_woman.svg");
export default {
  data() {
    return {
      iconMan: man,
      iconWoman: woman,
      iMan: iMan,
      iWoman: iWoman,
      suffererType: 1,
      // 病区信息
      wardInfo: 1,
      query_key: "",

      loading: false,
      // 真实的
      loginInfo: {}, // 登录信息
      DepartmentList: [], // 部门列表
      departmentCode: "", // 当前的部门代码
      yljgdm: "", // 当前的部门机构代码
      initSelectValue: "", // 初始选择第一个输入框内容
      // 患者列表
      cardsInfoList: [],

      // 搜索功能
      showPop: false, // 校验用的禁用弹出
      searchDataList: [], // 搜出的人的信息列表
    };
  },
  created() {
    this.getDepartmentList();
    // 拿到用户登录的信息
    this.loginInfo = this.$storage.get("vuex").userMessage;
    // this.getSuffererList();
  },
  methods: {
    // 搜索的时候的方法
    async loadTableInfo() {
      // this.$refs.pop.doShow();
      this.showPop = false;
      if (this.query_key.trim() === "") {
        this.$message({
          message: "请输入内容后查询",
          type: "warning",
        });
        // this.$refs.pop.doClose();
        this.showPop = true;
        return false;
      }
      try {
        const params = {
          contactNo: this.query_key,
          encounterId: this.query_key,
          fullName: this.query_key,
          idcardNo: this.query_key,
          imrn: this.query_key,
          omrn: this.query_key,
          pageIndex: 0,
          pagesize: 5,
        };
        const data = await this.$api.gethzxxSearchList(params);
        this.searchDataList = data.content;
        this.$refs.pop.doShow();
      } catch (error) {
        console.log(error);
      }
    },

    // 点击搜索某行的时间
    clickData(row, event, column) {
      // row能拿到当前行的数据
      console.log(row, event, column);
      // todo.............. 应该和点卡片一样 都是调Infos存入用户info
      this.$store.commit("SET_Infos", row);
      this.$router.push({ path: "/inspectReport" });
    },

    // .............................................todo
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
        inDeptNo: this.departmentCode,
        hospitalSoid: this.yljgdm,
        pageIndex: 0,
        pageSize: 999,
      };
      return new Promise((resolve, reject) => {
        this.$api.getZyjzlistByKsdmNew(params).then((res) => {
          // 格式化数据(引入自tools)
          this.cardsInfoList = res.content;
          // 通过卡片信息数据调(手术、过敏信息)
          const arrParams = [];
          this.cardsInfoList.forEach((items) => {
            const coreInfo = {
              patid: items.bizRoleId,
              jzlsh: items.encounterId,
              jzlb: items.encounterTypeNo,
              yljgdm: items.hospitalSoid,
              yexh: items.yexh || "0",
              brzt: 1,
            };
            arrParams.push(coreInfo);
          });

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

    /**
     * @description: 点击卡片跳转首页
     */
    clickPatientCard(userInfo) {
      // 还要调用两个接口，拿到数据存入vuex持久化
      // 把这个人的信息存入vuex持久化 ,
      // 然后layout页面根据这个对象中的参数去调时间轴和用户信息
      this.$store.commit("SET_Infos", userInfo);
      this.$router.push({ path: "/inspectReport" });
    },
  },
};
</script>

<style lang="scss" scoped>
.patient_view_container {
  .query_area {
    width: 300px;
    display: inline-block;
    margin-left: 36px;
  }

  .query_key {
    width: 430px;
    display: inline-block;
    margin-left: 20px;
    margin-right: 16px;
    font-size: 14px;
  }

  .sufferer_list {
    margin-top: 12px;
    padding-top: 12px;
    width: 100%;
    height: calc(100vh - 150px);
    overflow: auto;
    // 滚动条
    &::-webkit-scrollbar {
      width: 0px;
      height: 10px;
      background-color: #ccc;
    }
    .sufferer_card {
      width: 376px;
      height: 210px;
      margin-top: 4px;
      position: relative;
      float: left;
      padding: 0;
      background: url("../../assets/images/icon_sufferer_card.svg") no-repeat;
      background-size: 100% 100%;
      .sufferer_user {
        cursor: pointer;
        width: 100%;
        height: 80px;
        position: relative;
        font-size: 20px;
        color: #000000;
        font-weight: 500;
        padding: 24px 0 0 80px;
        span {
          font-size: 14px;
        }
        .user-avatar {
          position: absolute;
          width: 40px;
          height: 40px;
          top: 22px;
          left: 28px;
        }
        .text_bed {
          height: 20px;
          line-height: 20px;
        }
        .text_user {
          font-size: 14px;
          color: #000000;
          font-weight: 400;
          line-height: 22px;
          .sep_line {
            width: 1px;
            height: 16px;
            margin: 0 10px 0 6px;
            border-left: 1px solid rgba(201, 201, 201, 1);
          }

          .i_sex {
            margin-left: 10px;
            width: 18px;
            height: 18px;
            vertical-align: middle;
          }
        }

        .sufferer_symptom {
          position: absolute;
          top: 22px;
          right: 24px;
          span {
            background: #fc3b3b;
            width: 30px;
            height: 30px;
            line-height: 32px;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            border-radius: 50%;
            display: inline-block;
            text-align: center;
            margin-right: 2px;
            transform: scale(0.8, 0.8);
          }

          .text_rating_1 {
            background: #ffa5c1;
          }

          .text_rating_2 {
            background: #4a83fa;
          }
          .text_rating_3 {
            background: #94e239;
          }
        }
      }
      .sufferer_illness {
        width: 100%;
        height: 130px;
        padding: 16px 0 0 40px;
        position: relative;
        .sufferer_illness_detail {
          font-size: 18px;
          color: #666666;
          font-weight: 500;
          height: 32px;
          line-height: 32px;
          img {
            width: 16px;
            height: 16px;
            vertical-align: -6%;
            margin-right: 4px;
          }
          span {
            color: #000000;
            margin-left: 8px;
          }
        }

        .sufferer_focus {
          position: absolute;
          bottom: 22px;
          right: 24px;
          font-size: 28px;
          color: #7e89a4;
          margin-right: 6px;
          :hover {
            cursor: pointer;
          }
          .i_icon {
            width: 24px;
          }
        }
      }
    }
  }
}
</style>
