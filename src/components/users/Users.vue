<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="userCode"></el-table-column>
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="手机" prop="userPhone"></el-table-column>
        <el-table-column label="身份证" prop="idCard"></el-table-column>
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
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-upload
          class="avatar-uploader"
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form-item label="用户名" prop="userCode">
          <el-input v-model="addForm.userCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="addForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="addForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="userPhone">
          <el-input v-model="addForm.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="addForm.idCard"></el-input>
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
          <el-select v-model="addForm.role" placeholder="请选择">
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
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
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
        <el-form-item label="用户名" prop="userCode">
          <el-input v-model="editForm.userCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="editForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="userPhone">
          <el-input v-model="editForm.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="editForm.idCard"></el-input>
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
          <el-select v-model="editForm.role" placeholder="请选择">
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
    // 验证手机号规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
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
      total: 0,
      isShow: true,
      // 控制用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {},
      roleOptions: [
        { label: '管理员', value: '0' },
        { label: '医生', value: '1' },
        { label: '用户', value: '2' }
      ],
      sexList: [
        { label: '女', value: '1' },
        { label: '男', value: '2' }
      ],
      addFormRules: {
        userCode: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        userCode: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
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
        { role: 2, userName: this.queryInfo.query }
      )
      if (res.code !== 0) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.data
      this.total = res.data.total
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
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('/api1/addUser', {
          imgPath: this.userPicture,
          role: this.addForm.role,
          userCode: this.addForm.userCode,
          userName: this.addForm.userName,
          userPassword: this.addForm.userPassword,
          userPhone: this.addForm.userPhone,
          idCard: this.addForm.idCard,
          sex: this.addForm.sex
        })

        if (res.code !== 0) {
          this.$message.error('添加用户失败!')
        }

        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        this.imageUrl = ''
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    async showEditDialog (userCode) {
      // console.log(userCode);
      const { data: res } = await this.$http.post('/api1/listUser', {
        userCode: userCode
      })

      if (res.code !== 0) {
        return this.$message.error('查询用户信息失败!')
      }
      this.editForm = res.data.data[0]
      // console.log(this.editForm);
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
            userPassword: this.editForm.userPassword,
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
