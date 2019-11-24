<template lang="pug">
div
  el-row(class="mt3 mb3" type="flex" justify="center")
    el-col(:xs="24" :sm="18" :md="12")
      h3 アカウント設定
  el-row(type="flex" justify="center")
    el-col(:xs="24" :sm="18" :md="12")
      el-tabs(type="card")
        el-tab-pane(label="基本情報")
          BasicForm(:user="currentUser")
        el-tab-pane(label="カード情報")
          //- CardForm(:user="currentUser")
        el-tab-pane(label="支払先")
          //- PaymentForm(:user="currentUser")
</template>

<script>
import { mapState } from 'vuex'
import BasicForm from '@/components/accounts/BasicForm'
import CardForm from '@/components/accounts/CardForm'
import PaymentForm from '@/components/accounts/PaymentForm'

export default {
  middleware: 'authenticated',
  components: {
    BasicForm,
    CardForm,
    PaymentForm
  },
  head() {
    return {
      title: 'アカウント | 設定'
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('auth', {
      currentUser: state => state.currentUser
    })
  },
  methods: {}
}
</script>

<style scoped></style>
