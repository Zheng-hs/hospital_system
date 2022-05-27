<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="card-content">
      <el-card class="card-one">
        <div slot="header">
          <span>个人资料</span>
        </div>
        <el-upload
          class="avatar-uploader"
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-show="isShow"
            :src="userInfo.imgPath"
            class="avatars"
            @click="changeIsShow"
          />
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="userinfos">
          <span><i class="el-icon-s-custom"></i>用户名</span>
          <span>{{ userCode }}</span>
        </div>
        <div class="userinfo">
          <span><i class="el-icon-user"></i>姓名</span>
          <span>{{ userName }}</span>
        </div>
        <div class="userinfo">
          <span><i class="el-icon-mobile-phone"></i>手机</span>
          <span>{{ userPhone }}</span>
        </div>
        <div class="userinfo">
          <span><i class="el-icon-postcard"></i>身份证</span>
          <span>{{ idCard }}</span>
        </div>
      </el-card>
      <el-card class="card-second">
        <div slot="header">
          <span>基本资料</span>
        </div>

        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本资料" name="first">
              <el-form
                :model="userInfo"
                :rules="userRules"
                ref="userFormRef"
                label-width="100px"
              >
                <el-form-item label="姓名" prop="userName">
                  <el-input v-model="userInfo.userName"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="idCard">
                  <el-input v-model="userInfo.idCard"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="userPhone">
                  <el-input v-model="userInfo.userPhone"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="userInfo.sex" placeholder="请选择">
                    <el-option
                      v-for="item in sexList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="btn">
                <el-button class="el-icon-refresh-right" @click="reset">
                  重 置</el-button
                >
                <el-button type="primary" class="el-icon-check" @click="edit">
                  保 存</el-button
                >
              </div>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <el-form
                :model="pswForm"
                :rules="pswRules"
                ref="pswForm"
                label-width="100px"
                status-icon
              >
                <el-form-item label="原密码" prop="rawPassword">
                  <el-input v-model="pswForm.rawPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="pswForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                  <el-input v-model="pswForm.checkPass"></el-input>
                </el-form-item>
              </el-form>
              <div class="btn">
                <el-button
                  class="el-icon-refresh-right"
                  @click="resetPassword"
                >
                  重 置</el-button
                >
                <el-button
                  type="primary"
                  class="el-icon-check"
                  @click="editPassword"
                >
                  保 存</el-button
                >
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.pswForm.checkPass !== '') {
          this.$refs.pswForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pswForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      userRules: {
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }]
      },
      pswRules: {
        rawPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ validator: validatePass, trigger: 'blur' },
          { required: true, message: '请输入新密码' }],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' },
          { required: true, message: '请确认密码' }
        ]
      },
      uploadURL: 'http://localhost:8082/api1/upload',
      imageUrl: '',
      isShow: true,
      userInfo: {},
      userCode: '',
      userPhone: '',
      idCard: '',
      userName: '',
      pswForm: {
        checkPass: '',
        rawPassword: '',
        newPassword: ''
      },
      sexList: [
        { label: '女', value: '1' },
        { label: '男', value: '2' }
      ]
    }
  },
  methods: {
    handleClick () {},
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path
      // console.log(this.userPicture);
    },
    changeIsShow () {
      this.isShow = !this.isShow
    },

    reset () {
      this.$refs.userFormRef.resetFields()
    },
    resetPassword () {
      this.$refs.pswForm.resetFields()
    },
    async getUserInfo () {
      const { data: res } = await this.$http.post('/api1/listUser', {
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId
      })
      this.userInfo = res.data.data[0]
      this.userCode = this.userInfo.userCode
      this.userPhone = this.userInfo.userPhone
      this.idCard = this.userInfo.idCard
      this.userName = this.userInfo.userName
      this.userPicture = this.userInfo.imgPath
    },
    edit () {
      console.log(1)
      this.$refs.userFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.post('/api1/updateUser', {
          imgPath: this.userPicture,
          userName: this.userInfo.userName,
          idCard: this.userInfo.idCard,
          userPhone: this.userInfo.userPhone,
          sex: this.userInfo.sex,
          userId: this.userInfo.userId,
          userCode: this.userInfo.userCode
        })

        if (res.code !== 0) {
          this.$message.error('更新用户信息失败!')
        }
        // 刷新数据列表
        this.getUserInfo()
        this.$message.success('修改用户信息成功')
      })
    },
    async editPassword () {
      this.$refs.pswForm.validate(async (valid) => {
        if (!valid) return
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.post(
        `/api1/updatePassword?newPassword=${
          this.pswForm.newPassword
        }&rawPassword=${this.pswForm.rawPassword}&userId=${
          JSON.parse(sessionStorage.getItem('userInfo')).userId
        }`
        )
        if (res.code === 0) { this.$message.success(res.msg) } else { this.$message.error(res.msg) }
      })
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.card-one {
  width: 30%;
  position: absolute;
}
.card-second {
  width: 60%;
  height: 500px;
  // position: absolute;
  float: right;
  margin-bottom: 20px;
}
.userinfos {
  width: 100%;
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  span {
    padding: 10px 0;
    font-size: 14px;
  }
  i {
    padding: 0 5px;
  }
}
.userinfo {
  width: 100%;
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  span {
    padding: 10px 0;
    font-size: 14px;
  }
  i {
    padding: 0 5px;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 219px;
  height: 219px;
  line-height: 219px;
  text-align: center;
}
.avatar {
  width: 219px;
  height: 219px;
  display: block;
}
.avatars {
  width: 219px;
  height: 219px;
  display: block;
  position: absolute;
}
.btn {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  .el-button {
    font-weight: bold;
  }
}
.el-input {
  width: 300px;
}
.el-select {
  width: 300px;
}
.el-form {
  margin-left: 100px;
}
</style>
