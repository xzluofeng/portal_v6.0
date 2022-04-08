<template>
  <div class="login-container">
    <div id="scroll">
      <div class="page-container">
        <div id="loginBox">
          <div class="loginImg"></div>
          <div class="login">
            <div class="inputBox">
              <div class="account">
                <div>账号</div>
                <input
                  type="text"
                  v-model="username"
                  placeholder="请输入账号"
                  onfocus="this.placeholder=''"
                  onblur="this.placeholder='请输入账号'"
                />
                <i></i>
              </div>
              <div class="password">
                <div>密码</div>
                <input
                  class="passwordInput"
                  v-model="password"
                  :type="types"
                  placeholder="请输入密码"
                  onfocus="this.placeholder=''"
                  onblur="this.placeholder='请输入密码'"
                />
                <i class="lookPassword" @click="checkPassword">
                  <img :src="require(`assets/${checkpasswordimages}`)" />
                </i>
              </div>
              <!-- 下拉机构选择 -->
              <div class="institution">
                <div class="cur-institution-wrapper">
                  <!-- 用el-select修改样式做下拉机构 -->
                  <el-select v-model="value" placeholder="请选择机构名称">
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
                    style="zoom: 120%"
                  />
                  <label for="remember">记住我</label>
                </div>
                <div class="forget" @click="showHelp = !showHelp">
                  忘记密码？
                </div>
                <div class="help hidden-block" v-if="showHelp">
                  请联系系统管理员获取帮助<i></i>
                </div>
              </div>
              <div class="misinput" v-if="showErrorMessage">
                用户名密码或机构代码错误，请重新输入
              </div>
              <div id="entry" @click="handleLogin">登录</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部开始 -->
      <div id="footer">
        <span class="hospitalName"></span>
        <span class="pull-right">© 2021 Winning Health 版权所有</span>
      </div>
    </div>
  </div>
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
      value: "", // 用户选择的门诊机构
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
    // 记住用户名
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
      // 更新一次本地存的记住的用户名
      this.$storage.set("username", this.username);
      // 手动清空token
      this.$store.commit("SET_TOKEN", "");
      if (this.usercode !== "" && this.password !== "") {
        const loginParam = {
          usercode: Base64.encode(this.username),
          password: Base64.encode(this.password),
          yljgdm: this.value,
        };
        // 调vuex中的登录接口（注意是异步的）
        await this.$store.dispatch("getToken", loginParam);
        if (this.$store.state.token === " undefined") {
          this.showErrorMessage = true;
          return false;
        } else {
          // 密码正确跳转看板页
          this.showErrorMessage = false;
          this.$router.push("/cardView");
        }
      }
    },
  },
};
</script>

<style lang='scss' scoped>
#footer {
  opacity: 0.3;
  bottom: 10px;
  width: 30vw;
  height: 5vh;
  color: #333333;
  font-size: 14px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px 5px 20px;
  background: #fff;
  color: #929292;
  .hospitalName {
    margin-right: 20px;
  }
}

#loginBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  width: 50vw;
  height: 30vw;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 0 10px 0 #a5c3e7;
}

.loginImg {
  float: left;
  width: 40%;
  height: 100%;
  background: url("~@/assets/images/loginImg.png") center center no-repeat;
  background-size: cover;
}

.login {
  width: 60%;
  height: 100%;
  float: right;
  padding: 5vw;
  /*输入框部分*/
  .inputBox {
    margin-top: 40%;
    transform: translateY(-55%);
    width: 100%;
    height: 70%;
    .account,
    .password,
    .institution {
      margin-top: 2vh;
      position: relative;
    }
    .account div,
    .password div {
      font-size: 18px;
      color: #528bce;
      visibility: hidden;
    }
    .account input,
    .password input {
      width: 100%;
      height: 34px;
      color: #333333;
      font-size: 18px !important;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      position: relative;
      border-bottom: 1px solid #0040c9;
    }
    input::-webkit-input-placeholder {
      /* placeholder颜色 */
      color: #7b7d80;
      /* placeholder字体大小 */
      font-size: 18px;
    }
    .account i {
      top: 26px;
      right: 8px;
      width: 20px;
      height: 20px;
      z-index: 1000;
      position: absolute;
      background-color: #fff;
    }

    .lookPassword {
      top: 28px;
      right: 3px;
      width: 24px;
      height: 20px;
      z-index: 1000;
      cursor: pointer;
      position: absolute;
      background-color: #fff;
    }

    .lookPassword.eyeOpen {
      background-image: url("~@/assets/images/eyeOpen.png");
    }
    /*记住我，忘记密码等*/
    .memory {
      width: 100%;
      height: 32px;
      margin-top: 15px;
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
      color: #4e88cd;
      cursor: pointer;
      font-size: 14px;
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
      width: 100%;
      height: 45px;
      color: #ffffff;
      font-size: 16px;
      cursor: pointer;
      line-height: 45px;
      margin-top: 17px;
      text-align: center;
      border-radius: 2px;
      background-color: #0040c9;
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
  height: 53px;
  border-bottom: 1px solid #0040c9;
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
  font-size: 16px !important;
}
/deep/.el-input__inner::-webkit-input-placeholder {
  /* placeholder颜色 */
  color: #7b7d80;
  /* placeholder字体大小 */
  font-size: 18px;
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
</style>
