<template>
  <el-container :class="['basic_layout_container']">
    <div class="backBox">
      <div class="logo">
        <img src="../../assets/images/loginLogo.svg" />
        <span>患者360视图</span>
      </div>
      <div class="loginCard">
        <div class="title">
          <div class="f1">欢迎登录</div>
          <div class="f2">Welcome aboard</div>
        </div>

        <div class="login">
          <div class="inputBox">
            <div class="account">
              <div class="logo">
                <img src="../../assets/images/loginAccount.svg" />
              </div>
              <input
                type="text"
                v-model="username"
                placeholder="请输入账号"
                onfocus="this.placeholder=''"
                onblur="this.placeholder='请输入账号'"
              />
              <i class="close" @click="username = ''">
                <img src="../../assets/images/loginClose.svg" />
              </i>
            </div>
            <div class="password">
              <div class="logo">
                <img src="../../assets/images/loginPassword.svg" />
              </div>
              <input
                class="passwordInput"
                v-model="password"
                :type="types"
                placeholder="请输入密码"
                onfocus="this.placeholder=''"
                onblur="this.placeholder='请输入密码'"
              />
              <i class="close L2" @click="password = ''">
                <img src="../../assets/images/loginClose.svg" />
              </i>
              <i class="lookPassword" @click="checkPassword">
                <img :src="require(`assets/${checkpasswordimages}`)" />
              </i>
            </div>
            <!-- 下拉机构选择 institutions-->
            <div class="institution">
              <div class="cur-institution-wrapper">
                <div class="logo">
                  <img src="../../assets/images/institutions.svg" />
                </div>
                <!-- 用el-select修改样式做下拉机构 -->
                <el-select
                  v-model="chooseInstitution"
                  placeholder="请选择机构名称"
                  class="institution"
                >
                  <el-option
                    v-for="item in institutions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="memory">
              <div class="remember" @click="rememberUsername">
                <input
                  class="ordinary-check"
                  id="remember"
                  type="checkbox"
                  v-model="isRememberPassword"
                  style="zoom: 130%"
                />
                <label for="remember">保存账号</label>
              </div>
              <div class="forget" @click="showHelp = !showHelp">忘记密码？</div>
              <div class="help hidden-block" v-if="showHelp">
                请联系系统管理员获取帮助<i></i>
              </div>
            </div>
            <div class="misinput" v-if="showErrorMessage">
              用户名密码或机构错误，请重新输入
            </div>
            <div id="entry" @click="handleLogin">
              <span> 登录 </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部开始 -->
      <div id="footer">
        <span class="pull-right">© 2021 Winning Health 版权所有</span>
      </div>
    </div>
  </el-container>
</template>

<script>
import { Base64 } from "js-base64";
export default {
  name: "login",
  data() {
    return {
      checkpasswordimages: "images/eyeClosed.png",
      types: "password",
      showErrorMessage: false, // 是否提示登录失败的错误的信息
      isRememberPassword: false, // 是否记住密码
      showHelp: false, // 是否显示忘记密码
      institutions: [], // 调接口拿到的机构列表
      chooseInstitution: "", // 用户选择的门诊机构
      username: "", // 用户名
      password: "", // 密码
    };
  },
  mounted() {
    this.getInstitutionList();
    // 记住账号代码
    this.username = this.$storage.get("username") || "";
    if (this.username) {
      this.isRememberPassword = true;
    } else {
      this.isRememberPassword = false;
    }
  },
  methods: {
    // 勾选保存账号
    rememberUsername() {
      // 点击后如果勾选上记住我 就本地存储用户名
      if (!this.isRememberPassword) {
        this.$storage.set("username", this.username);
      } else {
        this.$storage.remove("username");
      }
    },
    // 查看密码操作
    checkPassword() {
      if (this.checkpasswordimages === "images/eyeClosed.png") {
        this.checkpasswordimages = "images/eyeOpen.png";
        this.types = "text";
      } else {
        this.checkpasswordimages = "images/eyeClosed.png";
        this.types = "password";
      }
    },
    // 获取机构列表接口数据
    getInstitutionList() {
      return new Promise((resolve, reject) => {
        this.$api.getAllInstitutions().then((res) => {
          const list = res.data;
          this.institutions = list;
          resolve();
        });
      });
    },
    // 点击登录调用vuex
    async handleLogin() {
      if (this.username.trim() === "" || this.password.trim() === "" || this.chooseInstitution === '') {
        this.$message({
          showClose: true,
          message: "账户名或密码或医疗机构为必选",
          type: "warning",
        });
        return false
      }
      // 更新一次本地存的记住的用户名
      this.$storage.set("username", this.username);
      // 手动清空token
      this.$store.commit("SET_TOKEN", "");
      if (this.usercode !== "" && this.password !== "") {
        const loginParam = {
          usercode: Base64.encode(this.username),
          password: Base64.encode(this.password),
          yljgdm: Base64.encode(this.chooseInstitution),
        };
        // 调vuex中的登录接口（注意是异步的）
        await this.$store.dispatch("getToken", loginParam);
        if (this.$store.state.token === " undefined") {
          this.showErrorMessage = true;
          return false;
        } else {
          // 密码正确跳转看板页
          this.showErrorMessage = false;
          this.$router.push("/suffererView");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.basic_layout_container {
  width: 100%;
  height: 100%;
  position: relative;
  #footer {
    opacity: 0.6;
    bottom: 10px;
    font-family: SourceHanSansCN-Medium;
    font-size: 20px;
    color: #ffffff;
    font-weight: 500;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 20px 5px 20px;
    .hospitalName {
      margin-right: 20px;
    }
  }
  .backBox {
    width: 100%;
    height: 100%;
    background: url("~@/assets/images/loginBackPic.png") center center no-repeat;
    background-size: cover;
    .logo {
      position: absolute;
      left: 120px;
      top: 118px;
      img {
        width: 135px;
        height: 70px;
        vertical-align: middle;
      }
      span {
        display: inline-block;
        width: 289px;
        height: 74px;
        line-height: 74px;
        font-family: SourceHanSansCN-Bold;
        font-size: 40px;
        color: #2d5afa;
        letter-spacing: 0;
        font-weight: 700;
      }
    }
  }
  .loginCard {
    position: absolute;
    left: 60%;
    top: 12%;
    width: 540px;
    height: 660px;
    background-color: #fff;
    border-radius: 2px;
    padding: 60px 60px;
    .title {
      width: 403px;
      height: 80px;
      text-align: left;
      float: left;
      .f1 {
        font-family: SourceHanSansCN-Medium;
        font-size: 36px;
        color: #000000;
        font-weight: 500;
      }
      .f2 {
        margin: 10px 0px;
        font-family: SourceHanSansCN-Regular;
        font-size: 24px;
        color: #333333;
        letter-spacing: 1px;
        font-weight: 400;
      }
    }
    .login {
      width: 100%;
      height: 100%;
      /*输入框部分*/
      .inputBox {
        margin-top: 28%;
        width: 100%;
        height: 80%;
        .account,
        .password,
        .cur-institution-wrapper {
          margin-top: 3.5vh;
          position: relative;
        }
        .logo {
          position: absolute;
          left: 0px;
          top: 13px;
          z-index: 1000;
          img {
            width: 20px;
            height: 20px;
          }
        }
        .account input,
        .password input {
          width: 100%;
          height: 54px;
          color: #333333;
          font-size: 18px !important;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          position: relative;
          border-bottom: 1px solid #c9c9c9;
          padding-left: 30px;
        }
        input::-webkit-input-placeholder {
          color: #7b7d80;
          font-size: 18px;
        }

        .account i {
          top: 26px;
          right: 7px;
          width: 20px;
          height: 20px;
          z-index: 1000;
          position: absolute;
          background-color: #fff;
        }
        .close {
          top: 28px;
          right: 13px;
          z-index: 1000;
          cursor: pointer;
          position: absolute;
          background-color: #fff;
          img {
            width: 18px;
            height: 18px;
          }
        }
        .L2 {
          top: 26px;
          right: 8px;
        }
        .lookPassword {
          top: 25px;
          right: 43px;
          width: 24px;
          height: 20px;
          z-index: 1000;
          cursor: pointer;
          position: absolute;
          background-color: #fff;
          img {
            width: 22px;
          }
        }
        /*记住我，忘记密码等*/
        .memory {
          width: 100%;
          height: 32px;
          margin-top: 35px;
          line-height: 32px;
          position: relative;
          vertical-align: middle;
        }

        .remember {
          float: left;
          margin-top: 4px;
        }

        .remember label {
          top: -4px;
          left: 8px;
          color: #333333;
          font-size: 14px;
          position: relative;
        }

        .forget {
          float: right;
          color: #2d5afa;
          cursor: pointer;
          font-size: 16px;
        }

        .help {
          top: 32px;
          right: 0px;
          width: 213px;
          height: 30px;
          // display: none;
          color: #ffffff;
          font-size: 12px;
          line-height: 30px;
          border-radius: 2px;
          text-align: center;
          background: #475460;
          position: absolute;
        }

        .help i {
          top: -3px;
          right: 18px;
          width: 8px;
          height: 8px;
          position: absolute;
          display: inline-block;
          background-color: #475460;
          transform: rotate(45deg);
          -o-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
        }

        /*信息有误提示信息*/
        .misinput {
          width: 260px;
          color: #d0021b;
          // visibility: hidden;
          font-size: 12px;
          margin-top: 5px;
          text-align: center;
        }

        /*登录按钮*/
        #entry {
          width: 428px;
          height: 54px;
          color: #ffffff;
          font-size: 16px;
          cursor: pointer;
          line-height: 54px;
          margin-top: 80px;
          text-align: center;
          border-radius: 2px;
          background-color: #2d5afa;
          span {
            font-family: SourceHanSansCN-Regular;
            font-size: 21px;
            color: #ffffff;
            letter-spacing: 4px;
            line-height: 31px;
            font-weight: 400;
          }
        }

        #entry:active {
          background-color: #475460;
        }
      }
    }
    input {
      font-size: 16px !important;
    }

    /deep/input::-webkit-input-placeholder {
      font-size: 16px;
      color: #475460;
    }
    input:focus {
      //获取焦点
      outline: none; //边框不用border，用outline
      font-size: 16px;
    }
    // 选择机构的
    .cur-institution-wrapper {
      width: 100%;
      height: 54px;
      color: #333333;
      font-size: 18px !important;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      border-bottom: 1px solid #c9c9c9;
      cursor: pointer;
    }
    .cur-institution-wrapper {
      width: 100%;
    }
    /deep/.el-select {
      width: 100%;
    }
    /deep/.el-input--medium .el-input__inner {
      height: 50px;
      width: 100%;
      font-size: 18px !important;
      padding-left: 30px !important;
    }
    /deep/.el-input__inner::-webkit-input-placeholder {
      /* placeholder颜色 */
      color: #7b7d80;
      /* placeholder字体大小 */
      font-size: 18px;
    }
    /deep/.el-icon-arrow-up:before {
      font-size: 20px !important;
    }
    /deep/.el-input__inner,
    /deep/.el-select .el-input__inner:focus,
    /deep/.el-input__inner:hover,
    /deep/.el-select .el-input__inner:focus,
    /deep/.el-select:hover .el-input__inner,
    /deep/.el-select .el-input.is-focus .el-input__inner,
    /deep/.el-select .el-input__inner:focus {
      border: 1px solid transparent !important;
      padding: 0px;
    }
  }
}
</style>
