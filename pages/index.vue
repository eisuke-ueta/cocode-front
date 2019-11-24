<template lang="pug">
div
  | Index
</template>

<script>
export default {
  middleware: 'notAuthenticated',
  components: {},
  head() {
    return {
      titleTemplate: null,
      title: 'CoCode | Market Platform for engineer'
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped></style>
