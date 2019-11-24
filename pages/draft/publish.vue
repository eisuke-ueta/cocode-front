<template lang="pug">
NoteForm
</template>

<script>
import NoteForm from '@/components/notes/NoteForm'

export default {
  layout: 'draft',
  middleware: 'authenticated',
  components: {
    NoteForm
  },
  head() {
    return {
      title: '新規作成'
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style scoped></style>
