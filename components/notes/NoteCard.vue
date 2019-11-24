<template lang="pug">
div(@click="handleClick")
  el-card(class="card" :body-style="{ padding: '0px' }" shadow="hover")
    img(v-if="note.thumbnail" :src="note.thumbnail")
    div(class="pa3")
      div(class="mb3")
        span(class="title") {{ note.title }}
      div(class="mb3")
        small(class="description") {{ getShortDescription }}
      el-row(type="flex" align="middle")
        el-col(:span="12")
          el-row(type="flex" align="middle")
            div(class="mr2 pt2")
              el-avatar(size="small" class="avater" :src="note.user.avatar")
            div
              div
                span {{ note.user.name }}
              div
                small {{ $moment(note.updatedAt).tz("Asia/Tokyo").format('YYYY年MM月DD HH時mm分') }}
        //- el-col(:span="12")
        //-   el-row(type="flex" justify="end" align="middle")
        //-     i(class="el-icon-star-off mr1 large-icon icon")
        //-     span 23

</template>

<script>
export default {
  props: {
    note: { type: Object, default: () => {}, required: true }
  },
  data() {
    return {}
  },
  computed: {
    getShortDescription() {
      return this.note.description.substring(0, 140)
    }
  },
  methods: {
    handleClick() {
      this.$router.push(`/notes/${this.note.id}`)
    }
  }
}
</script>
<style scoped>
.card:hover {
  cursor: pointer;
}
.avater:hover {
  cursor: pointer;
}
.icon:hover {
  cursor: pointer;
}
.title {
  font-size: 1.2rem;
}
</style>
