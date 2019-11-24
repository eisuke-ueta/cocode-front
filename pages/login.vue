<template lang="pug">
div(class="pa4")
  el-row(type="flex" justify="center")
    el-col(:xs="24" :sm="16" :md="8")
      el-card(shadow="never")
        div(slot="header")
          span ログイン
        div
          el-form(ref="login" :model="form" :rules="rules" name="login" @submit.native.prevent="handleSubmit('login')")
            el-form-item(type="email" prop="email")
              el-input(v-model="form.email" placeholder="メールアドレス" prefix-icon="el-icon-message")
            el-form-item(type="password" prop="password")
              el-input(v-model="form.password" placeholder="パスワード" prefix-icon="el-icon-lock" show-password)
            el-form-item
              el-button(class="block" type="primary" native-type="submit") ログイン
</template>

<script>
import { mapActions } from 'vuex'

export default {
  middleware: 'notAuthenticated',
  head() {
    return {
      title: 'ログイン'
    }
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {
            required: true,
            message: 'メールアドレスを入力してください',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: 'パスワードを入力してください',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    async handleSubmit(formName) {
      const isValid = await this.$refs[formName].validate()
      if (!isValid) return

      const response = await this.login({ form: this.form })
      if (response.status === 200) {
        this.$router.push('/home')
      } else {
        this.$message('ログインできませんでした。')
      }
    },
    ...mapActions('auth', ['login'])
  }
}
</script>
<style scoped></style>
