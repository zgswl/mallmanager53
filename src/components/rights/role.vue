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
      <el-table-column type="index" label="#" width="150"> </el-table-column>
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
    data() {
      return {
        form: {
          roleName: '',
          roleDesc: ''
        },
        rolelist: [],
        dialogFormVisibleAdd: false,
        dialogFormVisibleEdit:false
      }
    },
    created() {
      this.getRolelist()
    },
    methods: {
      async getRolelist() {
        // 除了登录之外的所有请求,都需要设置头部
        // const AUTH_TOKEN = localStorage.getItem('token')
        // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
        // 已经在拦截器中设置头部了
        const res = await this.$http.get(`roles`)
        console.log(res)
        this.rolelist = res.data.data
      },
      showAddRoleDia() {
        this.form = {}
        this.dialogFormVisibleAdd = true
      },
      showEditRoleDia(role) {
        // console.log(role)
        // alert(role)
        this.form = role
        this.dialogFormVisibleEdit = true
      },
      showDeleRoleMsgBox(role){
        // alert(role)
      },
      showSetUserRoleDia(role) {
        // alert(role)
      },
      // 编辑角色中的发送请求
      async editRole() {
        // alert('编辑角色')
        // users/:id
        const res = await this.$http.put(`roles/${this.form.id}`, this.form)
        // console.log(res)
        // 1关闭对话框
        this.dialogFormVisibleEdit = false
        // 更新视图
        this.getUserList()
      },
      async addRole() {
        // alert('添加角色')
        this.dialogFormVisibleAdd = false
        const res = await this.$http.post(`roles`, this.form)
        console.log(res)
        const { meta: { status, msg }, data } = res.data
        if (status === 201) {
          this.$message.success(msg)
          this.getRoleList()
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
