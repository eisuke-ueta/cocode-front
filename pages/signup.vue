<template lang="pug">
div(class="pa4" style="height: 100%")
  el-row(type="flex" justify="center")
    el-col(:xs="24" :sm="16" :md="8")
      el-card(shadow="never")
        div(slot="header")
          span 新規登録
        div
          el-form(ref="signup" :model="form" :rules="rules" name="signup" @submit.native.prevent="handleSubmit('signup')")
            el-form-item(type="name" prop="name")
              el-input(v-model="form.name" placeholder="名前" prefix-icon="el-icon-user")
            el-form-item(type="email" prop="email")
              el-input(v-model="form.email" placeholder="メールアドレス" prefix-icon="el-icon-message")
            el-form-item(type="password" prop="password")
              el-input(v-model="form.password" placeholder="パスワード" prefix-icon="el-icon-lock" show-password)
            el-form-item
              el-button(class="block" type="primary" native-type="submit") 新規登録
</template>

<script>
import { mapActions } from 'vuex'

export default {
  middleware: 'notAuthenticated',
  head() {
    return {
      title: '新規登録'
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '名前を入力してください',
            trigger: 'change'
          },
          {
            min: 3,
            max: 20,
            message: '名前は3文字以上5文字以下にしてください',
            trigger: 'change'
          }
        ],
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
          },
          {
            min: 6,
            max: 20,
            message: 'パスワードは6文字以上20文字以下にしてください',
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

      const response = await this.signup({ form: this.form })
      if (response.status === 200) {
        this.$router.push('/home')
      } else {
        this.$message('登録できませんでした。')
      }
    },
    ...mapActions('auth', ['signup'])
  }
}
</script>
<style scoped></style>
