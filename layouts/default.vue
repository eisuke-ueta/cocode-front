<template lang="pug">
el-container(class="default-container")
  el-header(class="header")
    el-row(type="flex" justify="center")
      el-col
        el-menu(mode="horizontal" @select="handleSelect")
          el-menu-item(class="header-title" index="/") CoCode
          el-menu-item(class="header-button float-right")
            el-dropdown(v-if="currentUser" class="mr3" @command="handleCommand")
              span(class="el-dropdown-link")
                el-avatar(size="small" :src="currentUser.avatar")
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(:command="getProfileUrl") プロフィール
                el-dropdown-item(divided command="/notes") ノート管理
                el-dropdown-item(divided command="/settings/account") アカウント設定
                el-dropdown-item(command='/logout') ログアウト
            el-button(v-if="currentUser && !isNewNotePage" size="small" type="primary" @click="handleCreate") 新規投稿
          el-menu-item(v-if="!currentUser" class="float-right" index="/signup") 新規登録
          el-menu-item(v-if="!currentUser" class="float-right" index="/login") ログイン
  el-main(class="main")
    nuxt
  //- el-footer(class="footer")
  //-   el-row(type="flex" justify="center" align="middle" class="footer-container mt3 mb3")
  //-     el-col(:xs="12")
  //-       small(class="mb2") &copy;2019 - Jinbay
  //-     el-col(:xs="12")
  //-       el-link(class="mr3 mb2" href="/contact" underline) お問い合わせ
  //-       el-link(class="mr3 mb2" href="/terms" underline) 利用規約
  //-       el-link(class="mr3 mb2" href="/privacy" underline) プライバシーポリシー
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      title: 'CoCode | Market Platform for engineer',
      isNewNotePage: this.$route.path === '/notes/create'
    }
  },
  computed: {
    getProfileUrl() {
      return '/profile/' + this.currentUser.alias
    },
    ...mapState('auth', ['currentUser'])
  },
  methods: {
    handleSelect(key, keyPath) {
      if (!key) return
      this.isNewNotePage = false
      this.$router.push(key)
    },
    handleCommand(path) {
      if (!path) return
      if (path === '/logout') {
        this.handleLogout()
      } else {
        this.isNewNotePage = false
        this.$router.push(path)
      }
    },
    handleCreate() {
      this.isNewNotePage = true
      this.$router.push('/draft')
    },
    async handleLogout() {
      const response = await this.logout()
      if (response.status === 200) {
        this.$router.push('/login')
      }
    },
    ...mapActions('auth', ['logout'])
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 99;
  padding: 0;
}
.header-title {
  font-size: 1.2rem;
  color: #303133 !important;
}
.header-title.is-active {
  border-bottom: none !important;
}
.header-button.is-active {
  border-bottom: none !important;
}
.main {
  padding-top: 60px !important;
}
.footer-container {
  margin: 0 auto;
  width: 100%;
  height: 100%;
}
.el-link {
  font-size: 0.8rem;
}
</style>
