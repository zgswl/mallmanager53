<template>
  <el-card class="box-card">
    <!-- 面包悄 -->
    <!-- / 首页 / 用户管理 / 用户列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input @clear="loadUserList()" clearable placeholder="请输入内容" v-model="query" class="inputsearch">
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="80"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="80">
      </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
        <!-- {{ create_time | fmtdate }} -->
        <template slot-scope="userlist">
          {{userlist.row.create_time | fmtdate}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <el-switch
          @change="changeMgState(scope.row)"
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
          size="mini"
          plain type="primary"
          icon="el-icon-edit"
          circle
          @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
          size="mini"
          plain
          type="danger"
          icon="el-icon-delete"
          circle
          @click="showDeleUserMsgBox(scope.row.id)"></el-button>
          <el-button
          @click="showSetUserRoleDia(scope.row)"
          size="mini"
          plain type="success"
          icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 -->
    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          {{currUsername}}
        </el-form-item>
        <el-form-item label="角色" label-width="100px">

          <!--
            如果select的绑定的数据值 和 option的value一样,就会显示option的label值
            -->
            {{currRoleId}}
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
            :label="item.roleName"
            :value="item.id"
            v-for="(item,i) in roles"
            :key="i"
            ></el-option>
          </el-select>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setRol()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      // username: "admin"
      // email: "adsfad@qq.com"
      // mobile: "12345678"
      // create_time: 1486720211
      // mg_state: true
      // id: 500
      // role_name: "超级管理员"
      userlist: [],
      mg_state: true,
      total: -1,
      pagenum: 1,
      pagesize: 2,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRol: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 分配角色
      currRoleId: 0,
      currUserId: -1,
      currUsername: '',
      //
      roles: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 分配角色 - 发送请求
    async setRol () {
      // users/:id/role
      // :id 要修改的用户的id值
      // 请求体中 rid 修改的新值角色id
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      })
      // console.log(res)
      // 关闭对话框
      this.dialogFormVisibleRol = false
    },
    // 分配角色 - 打开对话框
    async showSetUserRoleDia (user) {
      this.currUsername = user.username
      this.dialogFormVisibleRol = true

      // 获取所有的角色
      const res1 = await this.$http.get(`roles`)
      // console.log(res1)
      this.roles = res1.data.data

      // 给 currUserId赋值
      this.currUserId = user.id

      // 获取当前角户的角色id->rid
      const res = await this.$http.get(`users/${user.id}`)
      // console.log(res)
      // 接口文档的key名是role_id 其实是rid
      this.currRoleId = res.data.data.rid
      this.dialogFormVisibleRol = true
    },
    // 修改状态
    async changeMgState (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log(res)
    },
    // 编辑用户中的发送请求
    async editUser () {
      // users/:id
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      // console.log(res)
      // 1关闭对话框
      this.dialogFormVisibleEdit = false
      // 更新视图
      this.getUserList()
    },
    showEditUserDia (user) {
      // console.log(user)
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    showDeleUserMsgBox (userId) {
      this.$confirm('删除用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除请求
        // id
        const res = await this.$http.delete(`users/${userId}`)
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.getUserList()
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async addUser () {
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post(`users`, this.form)
      // console.log(res)
      const { meta: { status, msg }, data } = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.getUserList()
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    showAddUserDia () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    loadUserList () {
      this.getUserList()
    },
    searchUser () {
      this.getUserList()
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagenum = 1
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    async getUserList () {
      // query查询参数可以为空
      // pagenum当前页码不能为空
      // pagesize每页显示条数不能为空

      // 需要授权的 API 必须在请求头中使用 Authorization 字段提供 token 令牌
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      console.log('发起请求')

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      // console.log(res)
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data
      if (status === 200) {
        // 给表格数据赋值
        this.userlist = users
        // 给total赋值
        this.total = total
        // 提示
        this.$message.success(msg)
      } else {
        // this.$message.warning(msg)
      }
    }
  }
}
</script>

<style scoped>
  .box-card {
    height: 100%;
  }

  .inputsearch {
    width: 300px;
  }

  .searchRow {
    margin: 10px 0;
  }
</style>
