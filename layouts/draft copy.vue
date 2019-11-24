<template lang="pug">
el-container
  el-header(class="header")
    el-row(type="flex" justify="center")
      el-col
        el-menu(mode="horizontal" @select="handleSelect")
          el-menu-item(class="header-title" index="/") CoCode
  el-main
    nuxt
</template>

<script>
export default {
  data() {
    return {
      title: 'CoCode | Market Platform for engineer'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(key)
    }
  }
}
</script>

<style scoped>
.el-container {
  height: 100vh;
}
.el-header {
  padding: 0;
  width: 100%;
}
.el-main {
  padding: 0.5rem;
}
.header-title {
  font-size: 1.2rem;
  color: #303133 !important;
}
.header-title.is-active {
  border-bottom: none !important;
}
</style>
