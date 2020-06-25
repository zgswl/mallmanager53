<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col class="logo" :span="4">
          <img src="../../assets/logo.png" alt="中广深logo">
        </el-col>
        <el-col :span="18" class="middle">
          <h4>中广深电商后台管理系统</h4>
        </el-col>
        <el-col :span="2">
          <a class="logout" href="#">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="Aside" width="200px">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
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
