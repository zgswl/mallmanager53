<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col class="logo" :span="4">
          <img src="../../assets/logo.png" alt="中广深logo" />
        </el-col>
        <el-col :span="18" class="middle">
          <h4>中广深电商后台管理系统</h4>
        </el-col>
        <el-col :span="2">
          <a class="logout" @click.prevent="handleSigout()" href="#">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="Aside" width="200px">
        <el-menu :unique-opened="true" :router="true">
          <el-submenu :index="''+item1.order" v-for="(item1,index) in menus" :key="index">

            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>

            <el-menu-item
            :index="item2.path"
            v-for="(item2,index) in item1.children"
            :key="index">
              <i class="el-icon-circle-check"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
          <!-- 演示不同用户登录,显示不同权限 -->
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menus:[]
    }
  },
  // newVue之前自动触发

  beforeCreate () {
    // 获取token
    // const token = localStorage.getItem('token')

    // if (!token) {
      // token没有 -> 登录
      // this.$router.push({ name: 'login' })
    // }
    // if token e -> 继续渲染组件
  },
  created() {
    this.getMenus()
  },
  methods: {
    // 获取导航数据
    async getMenus() {
      const res = await this.$http.get(`menus`)
      console.log(res)
      this.menus = res.data.data
    },
    handleSigout () {
      localStorage.clear()
      this.$message.success('退出成功')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
  }

  .header {
    background-color: #b3c0d1;
  }

  .Aside {
    background-color: #d3dcd6;
  }

  .main {
    background-color: #e9eef3;
  }

  /* 头部样式 */
  .logo {
    padding: 0;
    margin: 0;
    line-height: 60px;
  }

  .logo img {
    width: 100px;
    height: 25px;
    text-align: center;
  }

  .middle {
    /* line-height: 60px; */
    color: blue;
    text-align: center;
  }

  .logout {
    line-height: 60px;
    text-decoration: none;
  }
</style>
