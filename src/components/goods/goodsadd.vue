<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

    <!-- 提示  -->
    <el-alert class="alert" title="添加商品信息" type="success" center show-icon></el-alert>

    <!-- 步骤条 -->
    {{active}}
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px;">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 最外层 -->
    <el-form label-position="top" label-width="80px" :model="form" style="height: 400px; overflow: auto;">
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>

          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <!-- {{SelecteOptions}} -->
            <el-cascader clearable expand-Trigger='hover' :options="options" v-model="SelecteOptions"
              :props="defaultProp" @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- 显示的是该三级分类的商品参数 -->
          <el-form-item
          :label="item1.attr_name"
          :key="i"
          v-for="(item1,i)
          in arrDyparams">
          <!-- 复选框组 -->
          <el-checkbox-group v-model="item1.attr_vals">
            <el-checkbox
            border
            v-for="(item2,i) in item1.attr_vals"
            :key='i'
            :label="item2"></el-checkbox>
          </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane name="4" label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        active: '1',
        // 添加商品的表单数据
        // this.$http.post(url,this.form)
        // goods_name	商品名称	不能为空
        // goods_price	价格	不能为空
        // goods_weight	重量	不能为空
        // goods_number	数量	不能为空
        // goods_cat	以为','分割的分类列表	不能为空
        // goods_introduce	介绍	可以为空
        // pics	上传的图片临时路径（对象）	可以为空
        // attrs	商品的参数（数组）	可以为空
        form: {
          goods_name: '',
          goods_cat: '',
          goods_price: '',
          goods_number: '',
          goods_weight: '',
          goods_introduce: '',
          pics: '',
          attrs: ''
        },
        // 级联选择器绑定的数据
        options: [],
        SelecteOptions: [1, 3, 6],
        defaultProp: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        arrDyparams: '',
        // checkList: []
      }
    },
    created() {
      this.getGoodsCate()
    },
    methods: {
      // 点击不同的tab时
      async tabChange() {
        // 如果点击的是第二个tab 同时 三级分类要有值
        if (this.active === '2') {
          if (this.SelecteOptions.length !== 3) {
            // 提示
            this.$message.warning('请先选择商品的三级分类')
            return
          }
          // 获取数据
          const res = await this.$http.get(`categories/${this.SelecteOptions[2]}/attributes?sel=many`)
          console.log(res)
          // attr_name attr_vals
          this.arrDyparams = res.data.data
          // 并不是所有的三级分类都有动态参数 -> ""->[]->v-for报错
          // this.arrDyparams 每个对象.attr_vals 字符串->数组-v-for
          this.arrDyparams.forEach(item => {
            item.attr_vals =
            item.attr_vals.length===0
            ?[]:item.attr_vals.trim().split(',')
          })
        }
      },
      // 级联选择器 @change 触发的方法
      handleChange() {

      },
      // 获取三级分类的信息
      async getGoodsCate() {
        const res = await this.$http.get(`categories?type=3`)
        console.log(res)
        this.options = res.data.data
      }
    }
  }
</script>

<style scoped>
  .alert {
    margin-top: 10px;
  }
</style>
