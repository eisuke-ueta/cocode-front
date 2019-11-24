<template lang="pug">
NoteForm(:note="note")
</template>

<script>
import { mapState } from 'vuex'
import NoteForm from '@/components/notes/NoteForm'

export default {
  layout: 'draft',
  middleware: 'authenticated',
  components: {
    NoteForm
  },
  head() {
    return {
      title: '編集 | ノート'
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('note', {
      note: state => state.note
    })
  },
  async asyncData({ params, store }) {
    await store.dispatch('note/getNote', { id: params.id })
  }
}
</script>

<style scoped></style>
