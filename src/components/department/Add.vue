<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>科室管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加科室</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容主体区域 -->
    <el-card>
      <div class="container">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="科室名称" prop="departmentName">
            <el-input v-model="addForm.departmentName"></el-input>
          </el-form-item>
          <el-form-item label="科室编号" prop="departmentCode">
            <el-input v-model="addForm.departmentCode"></el-input>
          </el-form-item>
          <el-form-item label="科室描述" prop="departmentDescribe">
            <el-input v-model="addForm.departmentDescribe"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部区域 -->
      <div class="footer">
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetaddForm">重 置</el-button>
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
      addForm: {},
      addFormRules: {
        departmentName: [
          { required: true, message: '请输入科室名称', trigger: 'blur' }
        ],
        departmentCode: [
          { required: true, message: '请输入科室编号', trigger: 'blur' }
        ],
        departmentDescribe: [
          { required: true, message: '请输入科室描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('/api1/addDepartment', {
          departmentCode: this.addForm.departmentCode,
          departmentDescribe: this.addForm.departmentDescribe,
          departmentName: this.addForm.departmentName,
          status: 0
        })

        if (res.code !== 0) {
          this.$message.error('添加科室失败!')
        }

        this.$message.success('添加科室成功')

        this.addForm = {}
      })
    },
    resetaddForm () {
      // console.log(this)
      this.$refs.addFormRef.resetFields()
    }
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
