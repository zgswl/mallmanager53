<template>
  <el-card class="box-car">
    <!-- 面包屑 权限-->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <!-- 按钮 -->
    <el-row class="addrolebtn">
      <el-col>
        <el-button type="success" @click="showAddRoleDia()">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 -->
    <!-- 编辑角色的对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag>{{item1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag>{{item2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">

                  <el-tag v-for="(item3,i) in item2.children" :key="i">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" label="#" width="80"> </el-table-column>

      <!--
        roleName: "主管"
        roleDesc: "技术负责人"
      -->
      <el-table-column prop="roleName" label="角色名称" width="200">
      </el-table-column>

      <el-table-column prop="roleDesc"" label=" 角色描述" width="200">
      </el-table-column>

      <el-table-column prop="address" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditRoleDia(scope.row)">
          </el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle
            @click="showDeleRoleMsgBox(scope.row.id)">
          </el-button>
          <el-button @click="showSetUserRoleDia(scope.row)" size="mini" plain type="success" icon="el-icon-check"
            circle>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      form: {
        roleName: '',
        roleDesc: ''
      },
      rolelist: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false
    }
  },
  created () {
    this.getRolelist()
  },
  methods: {
    async getRolelist () {
      // 除了登录之外的所有请求,都需要设置头部
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      // 已经在拦截器中设置头部了
      const res = await this.$http.get(`roles`)
      console.log(res)
      this.rolelist = res.data.data
    },
    showAddRoleDia () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    showEditRoleDia (role) {
      // console.log(role)
      // alert(role)
      this.form = role
      this.dialogFormVisibleEdit = true
    },
    showDeleRoleMsgBox (roleId) {
      this.$confirm('删除角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除请求
        // id
        const res = await this.$http.delete(`roles/${roleId}`)
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.getRolelist()
          // alert('删除角色')
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
    showSetUserRoleDia (role) {
      // alert(role)
    },
    // 编辑角色中的发送请求
    async editRole () {
      // alert('编辑角色')
      // users/:id
      const res = await this.$http.put(`roles/${this.form.id}`, this.form)
      // console.log(res)
      // 1关闭对话框
      this.dialogFormVisibleEdit = false
      // 更新视图
      this.getRolelist()
    },
    async addRole () {
      // alert('添加角色')
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post(`roles`, this.form)
      // console.log(res)
      const { meta: { status, msg }, data } = res.data
      if (status === 201) {
        this.getRolelist()
        this.$message.success(msg)
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style scoped>
  .box-card {
    height: 100%;
  }

  .addrolebtn {
    margin: 10px;
  }
</style>

// 行列布局 -> for嵌套

//
