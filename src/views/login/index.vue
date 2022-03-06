<template>
  <div class="login-container">
    <el-form
        class="login-form"
        ref="login-form"
        :model="user"
        :rules="formRules"
    >
      <el-form-item class="head">
        <span><h2>黑马头条号</h2></span>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input
            v-model="user.mobile"
            placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已阅读并同意与用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="onLogin" :loading="loginLoading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login} from "@/api/user";

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false
      },
      checked: false, //是否同意协议
      loginLoading: false, //登录 Loading 状态
      formRules: {
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'change'},
          {pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change'},
        ],
        code: [
          {required: true, message: '验证码不能为空', trigger: 'change'},
          {pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'change'},
        ],
        agree: [
          {validator: (rule, value, callback) => {
            if(value){
              callback()
            }else {
              callback(new Error('请同意用户协议'))

            }
            },
          message: '请勾选同意用户协议',
          trigger: 'change'},

        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onLogin() {
      //获取表单数据
      //const user = this.user
      //表单验证
      this.$refs["login-form"].validate(vaild => {
        if(!vaild) {
          return
        }else {
          this.login()
        }
      })
      //处理后端响应结果
      //成功
      //失败
    },
    login() {
      //通过
      //开启loading
      this.loginLoading = true
      login(this.user).then(res => {
        console.log(res);
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        //将接口返回的用户相关数据放到本地存储
        //本地存储只能存储字符串
        //需存储对象，数组类型，需把他们转为 JSON 格式字符串
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        //关闭loading
        this.loginLoading = false
        //跳转到首页
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log("登录失败",err);
        this.$message.error('手机号或验证码错误')
        this.loginLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./home.jpg") no-repeat;
  background-size: cover;
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
    .head span h2{
      justify-content: center;
      text-align: center;
      display: block;
    }
  }
}

</style>