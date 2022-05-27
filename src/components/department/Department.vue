<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>科室管理</el-breadcrumb-item>
      <el-breadcrumb-item>科室管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜素与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="科室名称" prop="departmentName"></el-table-column>
        <el-table-column label="id" prop="departmentId"></el-table-column>
        <el-table-column label="科室编号" prop="departmentCode"></el-table-column>
        <el-table-column label="科室描述" prop="departmentDescribe"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.departmentCode)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.departmentId)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改科室"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="科室名称" prop="departmentName">
          <el-input v-model="editForm.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="id" prop="departmentId">
          <el-input v-model="editForm.departmentId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="科室编号" prop="departmentCode">
          <el-input v-model="editForm.departmentCode"></el-input>
        </el-form-item>
         <el-form-item label="科室描述" prop="departmentDescribe">
          <el-input v-model="editForm.departmentDescribe"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pageNo: 1,
        // 当前每页显示多少条数据
        pageSize: 5
      },
      userList: [],
      total: 0,
      // 控制用户对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        departmentName: [
          { required: true, message: '请输入科室名称', trigger: 'blur' }
        ],
        departmentCode: [
          { required: true, message: '请输入科室编号', trigger: 'blur' }
        ],
        departmentDescribe: [
          { required: true, message: '请输入科室描述', trigger: 'blur' }
        ]
      },
      userInfo: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const {
        data: res
      } = await this.$http.post(
        `/api1/listDepartment?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`, {}
      )
      if (res.code !== 0) {
        return this.$message.error('获取科室列表失败!')
      }
      this.userList = res.data.data
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageNo = newPage
      this.getUserList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.imageUrl = ''
    },
    async showEditDialog (departmentCode) {
      const { data: res } = await this.$http.post('/api1/listDepartment', {
        departmentCode: departmentCode
      })

      if (res.code !== 0) {
        return this.$message.error('查询科室信息失败!')
      }
      this.editForm = res.data.data[0]
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.post(
          '/api1/updateDepartment',
          this.editForm
        )

        if (res.code !== 0) {
          this.$message.error('更新科室信息失败!')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        this.$message.success('修改科室信息成功')
      })
    },
    async removeUserById (departmentId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该科室, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      // 如果用户确认删除，则返回字符串confirm
      // 如果用户取消删除，则返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('/api1/deleteDepartment', [departmentId])
      if (res.code !== 0) {
        return this.$message.error('删除科室失败!')
      }
      this.$message.success('删除科室成功')
      this.getUserList()
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
</style>
