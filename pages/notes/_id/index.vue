<template lang="pug">
el-row(class="mt3 mb3" type="flex" justify="center")
  el-col(:xs="24" :sm="18" :md="12")
    Note(:note="note")
</template>

<script>
import { mapState } from 'vuex'
import Note from '@/components/notes/Note'

export default {
  middleware: 'authenticated',
  components: {
    Note
  },
  head() {
    return {
      title: 'ノート'
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

<style></style>
