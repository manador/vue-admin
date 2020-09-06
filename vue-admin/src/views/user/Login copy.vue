<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="nav-tabs">
        <li
          v-for="item in navTabs"
          :key="item.id"
          :class="{'current': item.current}"
          @click="toggleNav(item)"
        >{{ item.txt }}</li>
      </ul>

      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form" size="medium">
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="password2" class="item-form" v-show="mode === 'register'">
          <label>重复密码</label>
          <el-input type="text" v-model="ruleForm.password2" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validateCode, validatePass, validateEmail, stripscript } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if(validateEmail(value)){
        callback(new Error('用户名格式有误'));
      }else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      this.ruleForm.password = stripscript(value);
      value = this.ruleForm.password;

      if (value === '') {
        callback(new Error('请输入密码'));
      } else if(validatePass(value)){
        callback(new Error('密码为6-20位的数字+字母'));
      }else {
        callback();
      }
    };
    var validatePassword2 = (rule, value, callback) => {
      if (this.mode === 'login') {
        callback();
      }
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var checkCode = (rule, value, callback) => {
      this.ruleForm.code = stripscript(value);
      value = this.ruleForm.code;
      
      if (value === '') {
        return callback(new Error('请输入验证码'));
      } else if(validateCode(value)){
        callback(new Error('验证码格式有误'));
      }else {
        callback();
      }
    };
    return {
      navTabs: [
        { txt: "登录", current: true, type: 'login' },
        { txt: "注册", current: false, type: 'register' }
      ],
      mode: 'login',
      ruleForm: {
        username: '',
        password: '',
        password2: '',
        code: ''
      },
      rules: {
        username: [
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePassword2, trigger: 'blur' }
        ],
        code: [
          { validator: checkCode, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    toggleNav(data) {
      this.navTabs.forEach(element => {
        element.current = false;
      });
      data.current = true;
      //切换显示重复密码
      this.mode = data.type;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 339px;
  margin: auto;
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 50%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
  display: block;
  border-radius: 3px;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%); /* IE 9 */
  -moz-transform: translate(-50%, -50%); /* Firefox */
  -webkit-transform: translate(-50%, -50%); /* Safari 和 Chrome */
  -o-transform: translate(-50%, -50%);
}
.nav-tabs {
  text-align: center;
  li {
    display: inline-block;
    width: 83px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
}
.current {
  background-color: rgba(0, 0, 0, 0.1);
}
.login-form{
  margin-top: 30px;
  label{
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
}
.item-form{
  margin-bottom: 13px;
}
.block{
  display: block;
  width: 100%;
}
.login-btn{
  margin-top: 20px;
}
</style>
