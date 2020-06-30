<template>
  <el-card class="box-car">
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row class="addrolebtn">
      <el-col>
        <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      height="450"
      :data="caslist"
      style="width: 100%"
      row-key="cat_id"
      border
      default-expand-all
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

      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleDele: false,

    };
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    // 级联选择器 @change 触发的方法
    async getGoodsCate() {
      const res = await this.$http.get(`categories`);
      this.caslist = res.data.data;
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
