<template lang="pug">
div(class="pa3")
  el-form(
    ref="profile"
    :model="form"
    :rules="rules"
    name="profile"
    @submit.native.prevent="handleSubmit('profile')"
    label-width="120px")
    el-form-item(label="名前" prop="name")
      el-input(v-model="form.name" placeholder="名前")
    el-form-item(label="エイリアス" prop="alias")
      el-input(v-model="form.alias" placeholder="エイリアス")
    el-form-item
      el-button(size="small" class="float-right" type="primary" native-type="submit") 保存
</template>

<script scoped>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {},
  props: {
    user: { type: Object, default: () => {}, required: true }
  },
  data() {
    return {
      form: cloneDeep(this.user),
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
            message: '名前は3文字以上20文字以下にしてください',
            trigger: 'change'
          }
        ],
        alias: [
          {
            required: true,
            message: 'エイリアスを入力してください',
            trigger: 'change'
          },
          {
            min: 3,
            max: 25,
            message: 'エイリアスは3文字以上25文字以下にしてください',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  methods: {
    async handleSubmit(formName) {
      const isValid = await this.$refs[formName].validate()
      if (!isValid) return

      const response = await this.updateUser({ form: this.form })
      if (response.status === 200) {
        this.$message('保存しました。')
      } else {
        this.$message('保存できませんでした。')
      }
    },
    ...mapActions('user', ['updateUser'])
  }
}
</script>
<style scoped></style>
