<template>
  <div id="login">
    <el-button type="success">成功按钮</el-button>
    <el-button type="primary" round>主要按钮</el-button>
    <div class="btn tips">注册即可免费试用</div>
    <div class="login">
        <div class="mobile">
            <img src="~@/images/mobile.png"><input type="text" id="mobile" name="mobile" placeholder="请输入手机号码"/>
        </div>
        <div class="passwd">
            <img src="~@/images/passwd.png"><input type="text" id="passwd" name="passwd" placeholder="请输入密码"/>
        </div>
        <span class="forget">忘记密码？</span>
        <div class="line"></div>
        <div class="btn"><span>登  陆</span></div>
        <div class="btn"><span>立即注册</span></div>
        <div class="service-info">
            <span>客服QQ：800183639</span>
            <span>网站：www.kuai500.net</span>   
            <span>微信公众号：kuai500net</span>
            <img src="~@/images/wechat_pic.png"/>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login"
};
</script>

<style scoped>
@import "~@/css/login.css";
</style>
