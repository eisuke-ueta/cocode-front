<template lang="pug">
el-card(class="card" :body-style="{ padding: '0px' }" shadow="never")
  div(class="pa3")
    el-row(type="flex" align="middle")
      div(class="mr3")
        el-avatar(class="extra-large-avatar" :src="user.avatar")
      div(class="block")
        el-row(class="mb2" type="flex" align="middle")
          el-col
            span(class="name") {{ user.name }}
          el-col
            el-button(v-if="isMyProfile" size="small" class="float-right" @click="handleEdit") 編集
        el-row(class="mb3")
          span {{ user.biography }}
        el-row(type="flex" align="middle")
          strong(class="mr1") 31
          small(class="mr3") フォロー
          strong(class="mr1") 120
          small フォロワー
</template>

<script scoped>
import { mapState } from 'vuex'

export default {
  props: {
    user: { type: Object, default: () => {}, required: true }
  },
  data() {
    return {}
  },
  computed: {
    isMyProfile() {
      return this.user.id === this.currentUser.id
    },
    ...mapState('auth', {
      currentUser: state => state.currentUser
    })
  },
  methods: {
    handleEdit() {
      this.$router.push(`/profile/${this.user.alias}/edit`)
    }
  }
}
</script>
<style scoped>
.block {
  width: 100%;
}
.name {
  font-size: 1.4rem;
  font-weight: 700;
}
.extra-large-avatar {
  width: 104px;
  height: 104px;
}
</style>
