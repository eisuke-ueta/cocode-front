<template lang="pug">
div
  el-row(class="mt3 mb3" type="flex" justify="center")
    el-col(:xs="24" :sm="18" :md="12")
      UserForm(:user="user")
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import UserForm from '@/components/users/UserForm'

export default {
  middleware: 'authenticated',
  components: {
    UserForm
  },
  head() {
    return {
      title: '編集 | プロフィール'
    }
  },
  data() {
    return {}
  },
  computed: {},
  async asyncData({ params, store }) {
    const response = await store.dispatch('user/getUserByAlias', {
      alias: params.id
    })
    const user = cloneDeep(response.data.user)
    return {
      user: user
    }
  },
  methods: {}
}
</script>

<style scoped></style>
