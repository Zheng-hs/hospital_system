<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医生管理</el-breadcrumb-item>
      <el-breadcrumb-item>医生信息</el-breadcrumb-item>
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
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="工号" prop="userCode"></el-table-column>
        <el-table-column
          label="所属科室"
          prop="departmentName"
        ></el-table-column>
        <el-table-column label="职称" prop="jobName"></el-table-column>
        <el-table-column label="简介" prop="userDescribe" width="300px"></el-table-column>
        <el-table-column label="图片" prop="imgPath">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.imgPath"
              :preview-src-list="[scope.row.imgPath]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="sex">
          <template slot-scope="scope">
                {{scope.row.sex==='1'?'女':'男'}}
              </template>
        </el-table-column>
        <el-table-column
          label="角色"
          prop="role"
          :formatter="columnFormatter"
        ></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.userCode)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.userId)"
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
      title="修改医生"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-upload
          class="avatar-uploader"
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-show="isShow" :src="editForm.imgPath" class="avatars" @click="changeIsShow"/>
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item label="工号" prop="userCode">
          <el-input v-model="editForm.userCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="科室" prop="departmentName">
          <el-select
              v-model="editForm.departmentName"
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
        <el-form-item label="职称" prop="jobName">
          <el-input v-model="editForm.jobName"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="userDescribe">
          <el-input v-model="editForm.userDescribe"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editForm.sex" placeholder="请选择">
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
          <el-select v-model="editForm.role" placeholder="请选择" disabled>
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
      uploadURL: 'http://localhost:8082/api1/upload',
      imageUrl: '',
      userList: [],
      departmentForm: [],
      total: 0,
      isShow: true,
      // 添加用户的表单数据
      roleOptions: [
        { label: '管理员', value: '0' },
        { label: '医生', value: '1' },
        { label: '用户', value: '2' }
      ],
      sexList: [
        { label: '女', value: '1' },
        { label: '男', value: '2' }
      ],
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
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
          { required: true, message: '请选择科室', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
      },
      userInfo: '',
      columnList: [
        { label: '角色', prop: 'role', distName: 'roleOptions' },
        { label: '性别', prop: 'sex', distName: 'sexList' }
      ]
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
        `/api1/listUser?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,
        { role: 1, departmentName: this.queryInfo.query }
      )
      if (res.code !== 0) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.data
      this.total = res.data.total
      const { data: ret } = await this.$http.post('/api1/listDepartment', {})
      this.departmentForm = ret.data.data
    },
    changeIsShow () {
      this.isShow = !this.isShow
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
    async showEditDialog (userCode) {
      // console.log(userCode)
      const { data: res } = await this.$http.post('/api1/listUser', {
        userCode: userCode
      })

      if (res.code !== 0) {
        return this.$message.error('查询用户信息失败!')
      }
      this.editForm = res.data.data[0]
      // console.log(this.editForm)
      this.userPicture = this.editForm.imgPath
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.isShow = true
      this.imageUrl = ''
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起修改用户的网络请求
        const { data: res } = await this.$http.post(
          '/api1/updateUser',
          {
            imgPath: this.userPicture,
            userCode: this.editForm.userCode,
            userName: this.editForm.userName,
            jobName: this.editForm.jobName,
            userDescribe: this.editForm.userDescribe,
            idCard: this.editForm.idCard,
            userPhone: this.editForm.userPhone,
            sex: this.editForm.sex,
            role: this.editForm.role,
            userId: this.editForm.userId,
            departmentName: this.editForm.departmentName
          }
        )

        if (res.code !== 0) {
          this.$message.error('更新用户信息失败!')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        this.$message.success('修改用户信息成功')
      })
    },
    async removeUserById (userId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
      const { data: res } = await this.$http.post('/api1/deleteUser', [userId])
      if (res.code !== 0) {
        return this.$message.error('删除用户失败!')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    columnFormatter (row, column, cellValue, index) {
      const distName = this.columnList.filter((item) => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        // console.log(row)
        return this[distName].filter((item) => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(this.imageUrl)
      // console.log(res)
      this.userPicture = res.path
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
.avatars {
  width: 200px;
  height: 200px;
  display: block;
  position: absolute;
}
</style>
