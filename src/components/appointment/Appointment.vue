<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约挂号管理</el-breadcrumb-item>
      <el-breadcrumb-item>预约挂号管理</el-breadcrumb-item>
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
        <el-table-column label="科室" prop="departmentName"></el-table-column>
        <el-table-column label="医生" prop="doctorName"></el-table-column>
        <el-table-column label="职称" prop="jobName"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            {{
              scope.row.status === "0"
                ? "已预约"
                : scope.row.status === "1"
                ? "已完成"
                : "已取消"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="success"
              icon="el-icon-success"
              size="mini"
              @click="change(scope.row.registrationId)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-edit-outline"
              size="mini"
              @click="removeUserById(scope.row.registrationId)"
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
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.post(
        `/api1/listRegistration?pageNo=${this.queryInfo.pageNo}&pageSize=${this.queryInfo.pageSize}`,{}
      )
      if (res.code !== 0) {
        return this.$message.error('获取挂号列表失败!')
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
    async change (registrationId) {
      const {
        data: res
      } = await this.$http.post(`/api1/updateStatus?status=${1}`, [
        registrationId
      ])
      if (res.code === 0) this.$message.success(res.msg)
      this.getUserList()
    },
    async removeUserById (registrationId) {
      const {
        data: res
      } = await this.$http.post(`/api1/updateStatus?status=${2}`, [
        registrationId
      ])
      if (res.code === 0) this.$message.success('取消成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
