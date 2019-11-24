<template lang="pug">
div
  el-row(v-if="isSelected" class="mb2" type="flex" align="middle")
    el-col
      small {{ selected.length }}件のノートを選択中
    el-col
      el-button(class="float-right" size="small" type="danger" @click="handleOpenDeleteDialog") 削除
  el-table(
      ref="noteTable"
      :data="notes"
      @selection-change="handleSelectionChange")
      el-table-column(type="selection" width="55")
      el-table-column(property="title" label="タイトル" show-overflow-tooltip)
        template(slot-scope="scope")
          div {{ scope.row.title }}
          small {{ $moment(scope.row.updatedAt).tz("Asia/Tokyo").format('YYYY年MM月DD HH時mm分') }}
      el-table-column(property="status" label="ステータス" width="100")
        template(slot-scope="scope")
          el-tag(type="info") {{ getStatus(scope.row.status) }}
      el-table-column(property="status" label="アクション" width="100")
        template(slot-scope="scope")
          el-button(size="small" @click="handleClick(scope.row.id)") 編集

  //- Dialog
  el-dialog(title="ノートの削除" :visible.sync="deleteDialog")
    span ノートを削除します。本当によろしいですか？
    span(slot="footer")
      el-button(size="small" @click="deleteDialog = false") キャンセル
      el-button(size="small" type="danger" @click="handleDelete") 削除
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    notes: { type: Array, required: true }
  },
  data() {
    return {
      deleteDialog: false,
      selected: []
    }
  },
  computed: {
    isSelected() {
      return this.selected.length !== 0
    }
  },
  methods: {
    getStatus(status) {
      return status === 'draft' ? '下書き' : '公開'
    },
    handleOpenDeleteDialog() {
      this.deleteDialog = true
    },
    handleDelete() {
      this.selected.forEach(note => {
        this.deleteNote({ id: note.id })
      })
      this.deleteDialog = false
      window.location.reload(false)
    },
    handleSelectionChange(val) {
      this.selected = val
    },
    handleClick(id) {
      this.$router.push(`/draft/${id}/edit`)
    },
    ...mapActions('note', ['deleteNote'])
  }
}
</script>
<style scoped>
.title {
  font-size: 1.2rem;
}
</style>
