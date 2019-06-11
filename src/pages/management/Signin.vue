<template>
  <el-container class="signin-page"
    v-loading="loading"
    :style="{ 'background-image': `url(${setting.backgroundImg})` }">
    <el-main class="main">
      <div class="signin-form-container">
        <div class="header">
          <div class="logo">
            <img src="@/assets/images/logo.png">
          </div>
          <div class="name">{{setting.title}}</div>
          <div class="version"><span>{{setting.subtitle}}</span></div>
        </div>

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

          <el-checkbox v-model="form.remember">记住密码</el-checkbox>

          <el-form-item class="login-button-wrapper">
            <el-button type="success"
              :loading="submiting"
              class="login-button"
              @click.stop.prevent="makeLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>

    <el-footer class="footer" height="80px">
      <div class="browser">
        <img src="@/assets/icons/chrome.png">
        建议使用谷歌浏览器
        <a href="http://www.chromeliulanqi.com/" target="_blank">点击下载</a>
      </div>
      <div class="copyright">
        <span v-html="setting.copyright"></span>
      </div>
    </el-footer>

    <div class="android-app-qrcode">
      <div class="title">APP端下载二维码</div>
      <img src="http://shuangkong.oss-cn-qingdao.aliyuncs.com/%E9%85%8D%E7%BD%AE%E7%9B%B8%E5%85%B3%E6%96%87%E4%BB%B6/1535380235172/precontrol.png">
    </div>
  </el-container>
</template>

<script>
  import axios from 'axios'
  import { mapMutations } from 'vuex'
  import storage from '@/modules/storage'
  import menus from '@/modules/menus'
  import { getAPIBaseURL } from '@/modules/utils'
  import { signIn } from '@/modules/authentication'

  export default {
    name: 'Signin',

    data() {
      const rememberedAccount = storage.get('remembered-account')

      return {
        loading: true,
        setting: {
          title: '广元市应急管理综合平台',
          subtitle: '政府管理端',
          copyright: 'Copyright&copy;2018 &nbsp;&nbsp;四川捷信安科注册安全工程师事务有限公司 &nbsp;&nbsp;蜀ICP备18023936号-1',
          backgroundImg: 'static/images/login-bg.png'
        },

        submiting: false,

        form: {
          account: rememberedAccount ? rememberedAccount.account : null,
          password: rememberedAccount ? rememberedAccount.password : null,
          remember: !!rememberedAccount
        },

        formRules: {
          account: { required: true, message: '请输入账号', trigger: 'blur' },
          password: { required: true, message: '请输入密码', trigger: 'blur' }
        }
      }
    },

    methods: {
      ...mapMutations('account', ['setAccount']),

      async makeLogin() {
        try {
          const valid = await this.$refs.signinForm.validate()
          if (valid) {
            this.submiting = true
            const signed = await signIn(this.form)
            this.submiting = false
            if (signed) {
              this.setAccount(signed.user)

              if (this.form.remember)
                storage.set('remembered-account', this.form)
              else
                storage.remove('remembered-account')
              const redirect = menus.managementMenuItems
                .find(item => item.code === signed.menu[0].code).route
              this.$router.push(redirect)
            }
          }
        } catch (error) {
          this.submiting = false
        }
      }
    },

    async created() {
      const result = await axios.get(
        '/loginInterfaceConfiguration/getLoginInterfaceInfo',
        {
          params: { domainName: location.host },
          baseURL: getAPIBaseURL()
        }
      )

      if (result.data.status === 0 && result.data.data) {
        ['title', 'subtitle', 'copyright', 'backgroundImg'].forEach(key => {
          const value = result.data.data[key]
          if (value) this.setting[key] = value
        })
      }

      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  .signin-page {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center top;
    height: 100%;
    position: relative;
    min-width: 1000px;
    min-height: 600px;

    .android-app-qrcode {
      position: absolute;
      bottom: 15px;
      right: 15px;
      width: 120px;
      color: #fff;
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
      align-items: center;
    }

    .signin-form-container {
      width: 500px;
      margin: 0 auto;

      .header {
        background: #0094EE;
        text-align: center;
        padding: 16px 0 18px;
        border-radius: 5px 5px 0 0;

        .logo {
          width: 96px;
          height: 96px;
          margin: 0 auto 13px;
          img {
            width: 100%;
            height: 100%;
          }
        }

        .name, .version {
          color: #fff;
          font-size: 20px;
          line-height: 28px;
          font-weight: bold;
        }

        .version {
          position: relative;
          width: 234px;
          margin: 8px auto 0;
          &:before {
            content: '';
            display: block;
            position: absolute;
            top: 14px;
            left: 0;
            width: 60px;
            height: 1px;
            background: #fff;
            opacity: 0.2;
          }
          &:after {
            content: '';
            display: block;
            position: absolute;
            top: 14px;
            right: 0;
            width: 60px;
            height: 1px;
            background: #fff;
            opacity: 0.2;
          }
        }
      }

      .signin-form {
        padding: 20px 30px;
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
        }

        /deep/ input {
          height: 50px;
        }

        /deep/ .el-form-item__content {
          line-height: normal;
        }

        .login-button-wrapper {
          margin-top: 36px;

          .login-button {
            height: 50px;
            width: 100%;
            background: linear-gradient(-90deg,rgba(96,192,96,1),rgba(120,212,120,1));
            box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.13),1px 1px 3px 0px rgba(134,248,134,1);
            border-radius: 3px;
            border: 1px solid rgba(86,169,86,1);
            font-size: 18px;
            line-height: 24px;
          }
        }
      }
    }

    .footer {
      text-align: center;
      color: #fff;
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
