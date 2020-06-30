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
      arrDyparams:[]
    };
  },
  created() {
    this.getGoodCate();
  },

  methods: {
    // 级联选择器改变
    async handleChange() {
      if (this.SelectedOptions.length === 3) {
        // 获取动态参数
        const res = await this.$http.get(
          `categories/${this.SelectedOptions[2]}/attributes?sel=many`
          )

        this.arrDyparams = res.data.data
        this.arrDyparams.forEach(item => {
          item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })

        console.log(this.arrDyparams)

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
