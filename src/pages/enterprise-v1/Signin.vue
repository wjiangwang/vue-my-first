<template>
  <el-container class="signin-page">
    <el-main class="main">
      <div class="page-title">
        <div class="logo">
          <img src="@/assets/images/logo.png">
        </div>
        <div class="name">风险分级管控和隐患排查治理双重预防信息系统</div>
      </div>

      <div class="signin-form-container">
        <div class="title">企业端登录</div>

        <el-form class="signin-form"
          :model="form"
          :rules="formRules"
          :inline-message="true"
          ref="signinForm">
          <el-form-item prop="account">
            <el-input placeholder="请输入账号"
              v-model="form.account">
              <template slot="prepend">
                <img src="@/assets/icons/user.png" class="account-input-prefix">
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input placeholder="请输入密码"
              v-model="form.password"
              type="password"
              @keyup.enter.native="makeLogin">
              <template slot="prepend">
                <img src="@/assets/icons/secret.png" class="password-input-prefix">
              </template>
            </el-input>
          </el-form-item>

          <el-checkbox v-model="form.remember">记住我</el-checkbox>

          <el-form-item class="login-button-wrapper">
            <el-button type="primary"
              :loading="submiting"
              class="login-button"
              @click.stop.prevent="makeLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="footer">

        </div>
      </div>
    </el-main>

    <el-footer class="footer" height="80px">
      <div class="browser">
        <img src="@/assets/icons/chrome.png">
        建议使用谷歌浏览器
        <a href="http://www.chromeliulanqi.com/" target="_blank">点击下载</a>
      </div>
      <div class="copyright">
        Copyright&copy;2018 &nbsp;&nbsp;四川捷信安科注册安全工程师事务有限公司 &nbsp;&nbsp;蜀ICP备18023936号-1
      </div>
    </el-footer>

    <div class="android-app-qrcode">
      <div class="title">APP端下载二维码</div>
      <img src="http://shuangkong.oss-cn-qingdao.aliyuncs.com/%E9%85%8D%E7%BD%AE%E7%9B%B8%E5%85%B3%E6%96%87%E4%BB%B6/1535380235172/precontrol.png">
    </div>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { signIn, updateSession } from '@/modules/authentication'

export default {
  name: 'Signin',

  data() {
    return {
      submiting: false,

      form: {
        account: null,
        password: null,
        remember: false
      },

      formRules: {
        account: { required: true, message: '请输入账号', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' }
      }
    }
  },

  computed: {
    ...mapState('account', { user: 'model' })
  },

  methods: {
    ...mapActions('account', { loadAccount: 'loadData' }),

    async makeLogin() {
      try {
        const valid = await this.$refs.signinForm.validate()
        if (valid) {
          this.submiting = true
          const signined = await signIn(this.form)

          if (signined) {
            await this.loadAccount()
            updateSession({ user: this.user })
            this.$router.push({ path: '/' })
          }

          this.submiting = false
        }
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
.signin-page {
  background: url('../../assets/images/e-login-bg.png') no-repeat;
  background-size: 100% 100%;
  background-position: center top; 
  height: 100%;
  position: relative;

  .android-app-qrcode {
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 120px;
    color: #333;
    font-size: 14px;
    text-align: center;

    img {
      width: 100%;
      height: auto;
      vertical-align: top;
      margin-top: 10px;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;

    .logo {
      width: 64px;
      height: 64px;
      margin-right: 16px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .name {
      font-size: 40px;
      font-weight: 500;
      color: #fff;
    }
  }

  .signin-form-container {
    width: 360px;
    margin: 50px auto 0;
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.08);
    border-radius: 3px;
    
    .title {
      text-align: center;
      color: #585858;
      font-size: 20px;
      margin: 42px 0 21px;
    }

    .footer {
      height: 38px;
      background: rgba(32,53,128,0.01);
      box-shadow: 0px -1px 0px 0px rgba(0,0,0,0.07);
    }

    .signin-form {
      padding: 20px 15px;
      background: #fff;
      border-radius: 0 0 5px 5px;

      .account-input-prefix {
        width: 20px;
        height: 20px;
      }

      .password-input-prefix {
        width: 16px;
        height: 20px;
        margin: 0 2px;
      }

      /deep/ .el-form-item {
        margin-bottom: 15px;

        &.is-error {
          .el-input__inner, .el-input-group__prepend {
            border: 0;
          }

          .el-input-group {
            border: 1px solid #f56c6c;
            border-radius: 4px;
          }
        }

        &.is-success {
          .el-input__inner, .el-input-group__prepend {
            border: 0;
          }

          .el-input-group {
            border: 1px solid #67c23a;
            border-radius: 4px;
          }
        }
      }

      /deep/ .el-form-item:not(.is-error) {
        .el-input__inner:hover, .el-input__inner:focus  {
          border-color: #dcdfe6;
        }
      }

      /deep/ input {
        height: 50px;
        border-left: 0;
      }

      /deep/ .el-form-item__content {
        line-height: normal;

        .el-input-group__prepend {
          background: transparent;
          padding-right: 0;
        }
      }

      .login-button-wrapper {
        margin-top: 36px;

        .login-button {
          height: 50px;
          width: 100%;
          background: linear-gradient(90deg, rgba(5,179,255,1) 0%, rgba(0,126,229,1) 100%, rgba(85,51,255,1) 100%);
          border-radius: 3px;
          font-size: 16px;
          line-height: 21px;
        }
      }
    }
  }

  > .footer {
    text-align: center;
    color: #626262;
    font-size: 12px;

    .browser {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;

      img {
        width: 15px;
        height: 15px;
        margin-right: 6px;
      }

      a {
        color: #37A9FA;
        text-decoration: none;
        margin-left: 6px;
      }
    }

    .copyright p {
      margin-top: 5px;
    }
  }
}
</style>
