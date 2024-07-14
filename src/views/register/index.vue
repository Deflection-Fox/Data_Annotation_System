<template>
  <div class="register-container">
    <article class="header">
      <header>
        <el-avatar icon="el-icon-user-solid" shape="circle" />
        <span class="login">
          <em class="bold">已有账号？</em>
          <a href="/login">
            <el-button type="primary" size="mini">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        autocomplete="off"
        hide-required-asterisk="true"
        size="medium"
      >
        <div style="padding-top: 10px">
          <el-form-item label="用户名" prop="username">
            <el-col :span="10">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名" />
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-col :span="10">
              <el-input v-model="ruleForm.pwd" type="password" />
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码" prop="cpwd">
            <el-col :span="10">
              <el-input v-model="ruleForm.cpwd" type="password" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 40%" @click="register">注册</el-button>
          </el-form-item>
        </div>
      </el-form>
    </section>
    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      error: '',
      ruleForm: {
        username: '',
        pwd: '',
        cpwd: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
          message: '密码必须同时包含数字与字母,且长度为 8-20位'
        }],
        cpwd: [{
          required: true,
          message: '请确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    register() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$message({
            showClose: true,
            message: '注册成功，正在跳转到登录界面...',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 95%;

    input {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      -webkit-appearance: none;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    label {
      font-style: normal;
      font-size: 12px;
      color: $light_gray;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .header {
    border-bottom: 2px solid rgb(235, 232, 232);
    min-width: 980px;
    color: #666;

    header {
      margin: 0 auto;
      padding: 10px 0;
      width: 980px;

      .login {
        float: right;
      }

      .bold {
        font-style: normal;
        color: $light_gray;
      }
    }
  }

  > section {
    margin: 0 auto 30px;
    padding-top: 30px;
    width: 980px;
    min-height: 300px;
    padding-right: 100px;
    box-sizing: border-box;
  }

  .error {
    color: red;
  }
}
</style>

<style scoped>
/* 修改验证器样式 */
::v-deep .el-form-item.is-error .el-input__inner {
  border-color: #889aa4;
}
::v-deep .el-form-item.is-error .el-input__validateIcon {
  color: #889aa4;
}
::v-deep .el-form-item__error {
  color: #e6a23c;
}
</style>
