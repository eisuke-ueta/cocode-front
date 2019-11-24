<template lang="pug">
el-row(class="mt3 mb3" type="flex" justify="center")
  el-col(:xs="24" :sm="18" :md="12")
    NoteForm(:note="note")
</template>

<script>
import { mapState } from 'vuex'
import NoteForm from '@/components/notes/NoteForm'

export default {
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
  },
  methods: {}
}
</script>

<style scoped></style>
