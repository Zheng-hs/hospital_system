<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
        <div  class="avatar_box">
            <div>
                <img src="../assets/logo1.jpg" alt="">
            </div>
            <div>
                <h1>医院预约挂号管理系统</h1>
                <h4>Hospital Registration Management System</h4>
            </div>
        </div>
        <!-- 登录表单区域 -->
        <div  class="login_form">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule" label-width="0px" class="user_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.userCode" prefix-icon="iconfont icon-user" placeholder="用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password" placeholder="密码"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登 录</el-button>
                    <el-button type="info" @click="resetLoginForm">重 置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        userCode: '',
        password: ''
      },
      loginFormRule: {
        userCode: [
          { required: true, message: '请输入登录名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login/auth', this.loginForm)
        if (res.code !== 0) return this.$message.error(res.msg)
        this.$message.success('登录成功')
        // 1.将登录成功之后的token，保存到客户端的sessionStorage 中
        //   1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data)
        const { data: ret } = await this.$http.post('/login/current')
        sessionStorage.setItem('userInfo', JSON.stringify(ret.data))
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}

</script>

<style lang="less" scoped>
.login_container {
//   background-color:  rgb(156, 220, 248);
  height: 100%;
  background-image: url('../assets/back.jpg');
   background-size:100% 100%;
}
.login_box {
  width: 800px;
  height: 500px;
  background: rgba(255,255,255,0.5);
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;

  .avatar_box {
    // background: rgba(255,255,255,0.5);
    text-align: center;
    h1{
        margin: 0;
    }
    h4{
        margin: 0;
        font-style: italic;
        font-size: 15px;
    }
    img{
      width: 200px;
      height: 200px;
      border-radius: 50%;
      opacity:0.8;
      margin-bottom: 20px;
    }
  }

  .login_form {
  padding: 0 20px;
  box-sizing: border-box;
  border-radius: 10px;
  background: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  height: 300px;
  width: 300px;
  box-shadow: 0 0 10px rgb(147, 216, 244);
  .btns {
    display: flex;
    justify-content: space-around;
    padding-top: 20px;
  }
  }
  .user_form {
      width: 100%;
  }
}

</style>
