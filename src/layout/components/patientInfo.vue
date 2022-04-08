<template>
  <div class="patientInfo-wrap">
    <div class="avatar">
      <!-- 用户头像 -->
      <!-- <img src="@/assets/images/boy.png" class="user-avatar" /> -->
      <img
        src="@/assets/images/boy.png"
        class="user-avatar"
        v-if="userInfos.genderName === '男性'"
      />
      <img
        src="@/assets/images/girl.png"
        class="user-avatar"
        v-if="userInfos.genderName === '女性'"
      />
      <span>{{ userInfos.fullName }}</span>
      <span class="age">{{ userInfos.ageYear || "" }}岁</span>
      <span class="sex">{{ userInfos.genderName }}</span>
    </div>
    <span class="detailsInfo">
      <span>身份证号：</span>
      <span>{{ userInfos.idcardNo }}</span>
    </span>
    <span class="detailsInfo">
      <span>婚姻状况：</span>
      <span>{{ userInfos.maritalStatusName }}</span>
    </span>
    <span class="detailsInfo">
      <span>卡号：</span>
      <span>{{ userInfos.identityNo || "-" }}</span>
    </span>
    <span class="detailsInfo">
      <span>账户余额：</span>
      <span>{{ userInfos.prepaidAmount || "-" }}</span>
    </span>
    <span class="detailsInfo">
      <span>保险信息：</span>
      <span>{{ userInfos.medInstiInsurName || "-" }}</span>
    </span>
    <span class="detailsInfo">
      <span>联系电话：</span>
      <span v-if="userInfos.bizRoleTelecom">
        {{
          userInfos.bizRoleTelecom.length > 0
            ? userInfos.bizRoleTelecom[0].contactNo
            : "--"
        }}
      </span>
    </span>
    <el-tooltip
      class="item"
      effect="light"
      v-if="userInfos.bizRoleAddress"
      :content="
        userInfos.bizRoleAddress.length > 0
          ? userInfos.bizRoleAddress[0].addrDetail
          : '-'
      "
      placement="top-start"
    >
      <span class="detailsInfo address">
        <span>联系地址：</span>
        <span v-if="userInfos.bizRoleAddress">
          {{
            userInfos.bizRoleAddress.length > 0
              ? userInfos.bizRoleAddress[0].addrDetail
              : "-"
          }}
        </span>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "patientInfo",
  data() {
    return {
      address: "",
      age: "",
      userInfos: "",
    };
  },
  watch: {
    patientInfo: {
      handler: function (val, oldVal) {
        // 侦听到的值的变化赋值为infos双向绑定改变头部
        this.userInfos = val.content[0];
      },
    },
    // 深度观察监听
    deep: true,
    immediate: true,
  },

  computed: {
    // 获取vuex中的属性
    ...mapState(["userMessage", "patientInfo", "timeLineData"]),
  },

  mounted() {},

  /**
   * 方法部分
   * **/
  methods: {},
};
</script>

<style lang='scss' scoped>
.patientInfo-wrap {
  width: 100%;
  height: 50px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .avatar {
    display: flex;
    align-items: center;
    border-right: 1px dotted #eef2fd;

    // 用户头像
    .user-avatar {
      cursor: pointer;
      width: 33px;
      height: 33px;
      border-radius: 25px;
      // vertical-align: middle;
      margin-right: 16px;
      margin-left: 16px;
    }
    span {
      font-size: 20px;
      color: #212121;
      font-weight: bold;
      margin-right: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .detailsInfo {
    font-size: 16px;
    // 全部超出都不让换行
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    & :nth-child(1) {
      color: #707070;
    }
  }
  .address {
    display: inline-block;
    width: 200px;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 150px;
  }
}
</style>
