<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="nav-tabs">
        <li
          v-for="item in navTabs"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleNav(item)"
        >
          {{ item.txt }}
        </li>
      </ul>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="password2"
          class="item-form"
          v-show="mode === 'register'"
        >
          <label>重复密码</label>
          <el-input
            type="text"
            v-model="ruleForm.password2"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getCode"
                :disabled="codeButtonStatus.status"
              >
                {{ codeButtonStatus.text }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginButtonStatus"
          >
            {{ mode === "login" ? "登录" : "注册" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
// import { Message } from "element-ui";
import { getSms, userRegister, userLogin } from "@/api/login";
import { reactive, ref, onMounted } from "@vue/composition-api";
import {
  validateCode,
  validatePass,
  validateEmail,
  stripscript
} from "@/utils/validate";

export default {
  name: "Login",
  setup(props, { refs, root }) {
    /**
     * 声明数据
     */
    // 对象类型
    const navTabs = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);

    // 基础类型声明
    const mode = ref("login");
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true);
    // 验证码按钮禁用状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    //更新按钮状态
    const updateButtonStatus = params => {
      (codeButtonStatus.status = params.status),
        (codeButtonStatus.text = params.text);
    };

    // 倒计时
    const timer = ref(null);

    let validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6-20位的数字+字母"));
      } else {
        callback();
      }
    };
    let validatePassword2 = (rule, value, callback) => {
      if (mode.value === "login") {
        callback();
      }
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let checkCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value);
      value = ruleForm.code;

      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateCode(value)) {
        callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };

    const ruleForm = reactive({
      username: "",
      password: "",
      password2: "",
      code: ""
    });

    const rules = reactive({
      username: [{ validator: validateUserName, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      password2: [{ validator: validatePassword2, trigger: "blur" }],
      code: [{ validator: checkCode, trigger: "blur" }]
    });

    // 声明函数
    const toggleNav = data => {
      navTabs.forEach(element => {
        element.current = false;
      });
      data.current = true;
      // 切换显示重复密码
      mode.value = data.type;
      // 重置表单
      resetForm();
      clearCountDown();
    };

    /**
     * 重置表单
     */
    const resetForm = () => {
      refs.loginForm.resetFields();
    };
    /**
     * 获取验证码
     */
    const getCode = () => {
      // 进行提示
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空！");
        return false;
      }

      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式不正确，请重新输入！");
        return false;
      }
      // 修改获取验证码按钮状态
      updateButtonStatus({
        status: false,
        text: "发送中"
      });

      // 获取验证码
      let requestData = {
        username: ruleForm.username,
        module: mode.value
      };

      getSms(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 启动登录或注册按钮
          loginButtonStatus.value = false;

          // 调定时器，倒计时
          countDown(60);
        })
        .catch(error => {
          console.log(error);
        });
    };
    /**
     * 提交表单
     */
    const submitForm = formName => {
      refs[formName].validate(valid => {
        //表单验证通过
        if (valid) {
          let requestData = {
            username: ruleForm.username,
            password: sha1(ruleForm.password),
            code: ruleForm.code
          };
          if (mode.value === "login") {
            login(requestData);
          } else {
            register(requestData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**
     * 注册
     */
    const register = requestData => {
      //注册接口
      userRegister(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          //模拟注册登录
          toggleNav(navTabs[0]);
          clearCountDown();
        })
        .catch(error => {
          //注册失败时执行
          console.log(error);
        });
    };

    /**
     * 登录
     */
    const login = requestData => {
      userLogin(requestData)
        .then(response => {
          //登录成功
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          console.log(response);
        })
        .catch(error => {
          //登录失败处理
          console.log(error);
        });
    };

    /**
     * 倒计时
     */
    const countDown = number => {
      //检查定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      let time = number;

      timer.value = setInterval(() => {
        codeButtonStatus.text = `倒计时${time}秒`;
        // console.log('计时：'+time)
        if (time === -1) {
          clearInterval(timer.value);
          updateButtonStatus({
            status: false,
            text: "再次获取"
          });
        }

        time--;
      }, 1000);
    };

    /**
     * 清除倒计时
     */
    const clearCountDown = () => {
      //还原验证码按钮默认状态
      updateButtonStatus({
        status: false,
        text: "获取验证码"
      });
      //清除倒计时
      clearInterval(timer.value);
    };

    // 生命周期
    onMounted(() => {});

    return {
      navTabs,
      mode,
      loginButtonStatus,
      codeButtonStatus,
      ruleForm,
      rules,
      toggleNav,
      submitForm,
      getCode
    };
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
.login-form {
  margin-top: 30px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
}
.item-form {
  margin-bottom: 13px;
}
.block {
  display: block;
  width: 100%;
}
.login-btn {
  margin-top: 20px;
}
</style>
