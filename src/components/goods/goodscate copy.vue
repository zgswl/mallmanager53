<template>
  <el-card class="box-car">
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row class="addrolebtn">
      <el-col>
        <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="商品分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="添加分类" label-width="100px">
          <el-input v-model="cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="100px">
          <!-- 级联选择器 -->
          {{SelectedOptions}}
          <el-cascader
            clearable
            expand-Trigger="hover"
            :options="options"
            v-model="SelectedOptions"
            :props="defaultProp"
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table
      height="450"
      :data="caslist"
      style="width: 100%"
      row-key="cat_id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="分类名称" prop="cat_name"> </el-table-column>

      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeById(scope.row.goods_id)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      caslist: [],
      list: [],
      total: -1,
      pagenum: 1,
      pagesize: 2,

      dialogFormVisibleAdd: false,
      cat_name: "",
      dialogFormVisibleEdit: false,
      dialogFormVisibleDele: false
    };
  },
  created() {
    this.getGoodsCatels();
  },
  methods: {
    addGoodsCate() {
      this.dialogFormVisibleAdd = true;
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagenum = 1;
      this.pagesize = val;
      this.getGoodsCatelist();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.getGoodsCatelist();
    },
    // 给表格数据赋值
    async getGoodsCatels() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res)
      // this.caslist = res.data.data;
    },
    async getGoodsCatelist() {
      // query查询参数可以为空
      // pagenum当前页码不能为空
      // pagesize每页显示条数不能为空

      // 需要授权的 API 必须在请求头中使用 Authorization 字段提供 token 令牌
      // const AUTH_TOKEN = localStorage.getItem('token')
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      // console.log('发起请求')

      const res = await this.$http.get(
        `categories?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.caslist = res.data.data;
      const {
        meta: { status, msg },
        data: { cates, total }
      } = res.data;
      if (status === 200) {
        // 给total赋值
        this.total = total;
        // 提示
        this.$message.success(msg);
      } else {
        // this.$message.warning(msg)
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  height: 100%;
}
.addrolebtn {
  margin: 10px;
}
</style>
