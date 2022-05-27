<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医生管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加医生</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容主体区域 -->
    <el-card>
      <el-upload
        class="avatar-uploader"
        :action="uploadURL"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="container">
          <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="工号" prop="userCode">
          <el-input v-model="addForm.userCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="jobName">
          <el-input v-model="addForm.jobName"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="userDescribe">
          <el-input v-model="addForm.userDescribe"></el-input>
        </el-form-item>
        <el-form-item label="所属科室" prop="departmentName">
          <el-select
              v-model="addForm.departmentName"
              placeholder="请选择"
            >
              <el-option
                v-for="item in departmentForm"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentName"
              >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addForm.sex" placeholder="请选择">
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="list.role" disabled></el-input>
        </el-form-item>
      </el-form>
      </div>
    <!-- 底部区域 -->
    <div class="footer">
              <span slot="footer" class="dialog-footer">
        <el-button  @click="resetLoginForm">重 置</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </div>

    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      uploadURL: 'http://localhost:8082/api1/upload',
      imageUrl: '',
      addForm: {},
      departmentForm: [],
      list: { role: '医生' },
      sexList: [
        { label: '女', value: '1' },
        { label: '男', value: '2' }
      ],
      addFormRules: {
        userCode: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入职称', trigger: 'blur' }
        ],
        userDescribe: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    async getDepartment () {
      const { data: res } = await this.$http.post('/api1/listDepartment', {})
      this.departmentForm = res.data.data
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('/api1/addUser', {
          imgPath: this.userPicture,
          departmentName: this.addForm.departmentName,
          jobName: this.addForm.jobName,
          role: '1',
          userCode: this.addForm.userCode,
          userDescribe: this.addForm.userDescribe,
          userName: this.addForm.userName,
          sex: this.addForm.sex,
          userPassword: '1111'
        })

        if (res.code !== 0) {
          this.$message.error('添加医生失败!')
        }

        this.$message.success('添加医生成功')
        this.imageUrl = ''
        // 重新获取用户列表数据
        this.addForm = {}
      })
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path
    },
    resetLoginForm () {
      // console.log(this)
      this.$refs.addFormRef.resetFields()
    }
  },
  created () {
    this.getDepartment()
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
.container {
    width: 100%;
    display: flex;
    justify-content: center;
    .el-form {
        width: 60%;
    }
}
.footer {
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button {
        width: 150px;
    }
}
</style>>
