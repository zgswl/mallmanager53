<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width=" 80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-btn" type="primary">登录</el-button>

    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录请求
    async handleLogin () {
      // 希望异步操作的代码,看起来像同步代码
      // ES7 async+await
      const res = await this.$http.post('login', this.formdata)
      const {data, meta: { msg, status }} = res.data
      console.log(data)
      if (status === 200) {
        localStorage.setItem('token', data.token)
        console.log(localStorage.token)
        this.$router.push({ name: 'home' })
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-wrap .login-form {
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;
  }

  .login-wrap .login-btn {
    width: 100%;
  }
</style>
