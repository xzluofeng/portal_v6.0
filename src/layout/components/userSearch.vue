<template>
  <div class="userSearch-wrap">
    <div class="searcharea">
      <el-input
        class="elInput"
        v-model="query_key"
        :clearable="true"
        @change="loadTableInfo"
        placeholder="支持姓名/身份证/病历号/院内信息/医保卡号/联系电话"
      />
      <div class="confimButton">
        <el-popover
          placement="bottom"
          width="1100"
          ref="pop"
          trigger="click"
          :disabled="showPop"
        >
          <el-table :data="searchDataList" @row-click="clickData">
            <el-table-column width="100" label="门诊号/住院号" align="center">
              <template slot-scope="scope">
                {{
                  scope.row.encounterTypeNo === 4
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
      </div>
      <!-- 右侧更多搜索按钮 -->
      <!-- <div class="moreSearchButton">
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
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query_key: "",
      // 搜索功能
      showPop: false, // 校验用的禁用弹出
      searchDataList: [], // 搜出的人的信息列表
    };
  },
  methods: {
    // 搜索的时候的方法
    async loadTableInfo() {
      this.showPop = false;
      if (this.query_key.trim() === "") {
        this.$message({
          message: "请输入内容后查询",
          type: "warning",
        });
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
      this.$router.go(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.userSearch-wrap {
  width: 100%;
  height: 50px;
  background-color: #f7f7f7;
  .searcharea {
    display: flex;
    margin-left: 28px;
    height: 33px;
    .elInput {
      margin-top: 8px;
      width: 493px;
    }
    .confimButton {
      min-width: 100px;
      height: 35px;
      line-height: 11px;
      margin-top: 8px;
      transform: translateX(-88px);
      border: unset;
      border-radius: 0px 4px 4px 0px;
      color: #dde4fe;
    }
    // .moreSearchButton {
    //   transform: translateX(-80px);
    //   .cika,
    //   .yibaoka,
    //   .idcard {
    //     min-width: 100px;
    //     line-height: 12px;
    //     margin-top: 8px;
    //     margin-right: 8px;
    //     span {
    //       font-size: 16px;
    //       color: black;
    //     }
    //   }
    // }
  }
}
</style>
