<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示  -->
    <el-alert
      class="alert"
      title="只允许为第三级分类设置参数"
      type="error"
      center
      show-icon
    ></el-alert>

    <!-- 级联选择器 -->
    <el-form class="formcas" label-position="letf" label-width="80px">
      <el-form-item label="商品分类">
        <!-- 级联选择器 -->
        {{ SelectedOptions }}
        <el-cascader
          :show-all-levels="false"
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

    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <!-- 按钮 -->
        <el-button type="danger">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrDyparams"" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <!-- el-tag -->
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                type="primary"
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
                @click="showDeleUserMsgBox(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">静态参数</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择器绑定的数据
      options: [],
      SelectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDyparams: [],
      active: "1",
      list:[]
    };
  },
  created() {
    this.getGoodCate();
  },

  methods: {
    // tab切换时
    handleClick() {},
    // 级联选择器改变
    async handleChange() {
      if (this.SelectedOptions.length === 3) {
        // 获取动态参数
        const res = await this.$http.get(
          `categories/${this.SelectedOptions[2]}/attributes?sel=many`
        );

        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });

        console.log(this.arrDyparams);
      }
    },
    // 获取三级分类的数据
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res)
      this.options = res.data.data;
    }
  }
};
</script>

<style scoped>
.alert {
  margin-top: 20px;
}
.formcas {
  margin-top: 20px;
}
</style>
