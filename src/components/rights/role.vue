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
      <el-table-column type="expand" width="150">
        <template slot-scope="scope">
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <!-- 传角色id 和 权限id  -->
              <el-tag @close="deleRight(scope.row,item1.id)" closable type="">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">

                <el-col :span="4">
                  <el-tag @close="deleRight(scope.row,item2.id)" closable type="success">{{item2.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span="20">
                  <el-tag @close="deleRight(scope.row,item3.id)" closable type="warning"
                    v-for="(item3,i) in item2.children" :key="i">
                    {{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <!-- 无权限的提示 -->
          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>

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
          <el-button
          @click="showSetRightDia(scope.row)"
          size="mini"
          plain type="success"
          icon="el-icon-check"
            circle>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

<!-- 修改权限的对话框 -->
<el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
  <!-- 树形结构
    data -> 数据源 []
    show-checkbos -> 选择框
    node-key 每个节点的唯一标识 通常是data数据源中key 名id
    default-expanded-keys
    default-checked-keys
    props 配置项 {label,children}
    label 节点的文字标题和children节点的子节点,
    值都来源于data绑定的数据源中的该数据的key名 'label' 和 'children'
   -->
  <el-tree
  :data="data"
  show-checkbox
  node-key="id"
  :default-expanded-keys="[2, 3]"
  :default-checked-keys="[5]"
  :props="defaultProps">
  </el-tree>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisibleRight = false">确 定</el-button>
  </div>
</el-dialog>

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
      dialogFormVisibleEdit: false,
      dialogFormVisibleRight:false
    }
  },
  created () {
    this.getRolelist()
  },
  methods: {
    // 修改/分配 权限 - 打开对话框
    showSetRightDia(role){
      this.dialogFormVisibleRight = true
    },
    // 取消权限
    async deleRight (role, rightId) {
      // 请求路径：roles/:roleId/rights/:rightId 请求方法：delete
      // roleId	角色 ID	不能为空携带在url中
      // rightId	权限 ID	不能为空携带在url中
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      // 删除成功 ->更新整个表格 -> 没有必要
      // 删除成功 返回了200状态码和该角色的剩余权限
      // 删除成功 返回当前角色更新后的剩余权限 children
      role.children = res.data.data
      // this.getRolelist()
    },
    async getRolelist () {
      // 除了登录之外的所有请求,都需要设置头部
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      // 已经在拦截器中设置头部了
      const res = await this.$http.get(`roles`)
      // console.log(res)
      this.rolelist = res.data.data
      // console.log(this.rolelist)
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
