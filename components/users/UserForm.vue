<template lang="pug">
div(class="pa3")
  el-form(ref="profile" :model="form" :rules="rules" name="profile" @submit.native.prevent="handleSubmit('profile')")
    el-row(type="flex" align="middle")
      div(class="text-center mr4")
        croppa(
          class="mb3"
          v-model='avatarCroppa'
          disable-click-to-choose
          :accept="'image/png,image/jpeg'"
          :show-loading="true"
          :file-size-limit="2097152"
          :width="104"
          :height="104"
          :prevent-white-space="true"
          :show-remove-button="false"
          :initial-image="form.avatar"
          @new-image-drawn="handleCroppaNewImageDrawn"
          @file-size-exceed="handleCroppaFileSizeExceed"
          @file-type-mismatch="handleCroppaFileTypeMismatch"
        )
        el-button(class="block" size="mini" @click="handleChooseFile") アップロード
      div(class="block")
        el-form-item(type="name" prop="name")
          el-input(v-model="form.name" placeholder="名前")
        el-form-item(type="biography" prop="biography")
          el-input(v-model="form.biography" :rows="3" type="textarea" placeholder="あなたの自己紹介を書きましょう（140文字以内）")
    el-form-item
      el-button(size="small" class="float-right" type="primary" native-type="submit") 保存
      el-button(size="small" class="float-right mr2" @click="handleCancel") キャンセル
</template>

<script scoped>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {},
  props: {
    user: { type: Object, default: () => {}, required: true }
  },
  data() {
    return {
      form: cloneDeep(this.user),
      file: null,
      isInitialAvatar: true,
      isAvatarUpdated: false,
      avatarCroppa: null,
      rules: {
        name: [
          {
            required: true,
            message: '名前を入力してください',
            trigger: 'change'
          },
          {
            min: 3,
            max: 20,
            message: '名前は3文字以上20文字以下にしてください',
            trigger: 'change'
          }
        ],
        biography: [
          {
            max: 140,
            message: '自己紹介は140文字以内にしてください。',
            trigger: 'change'
          }
        ]
      },
      feedback: ''
    }
  },
  computed: {},
  methods: {
    handleCancel() {
      this.$router.push(`/profile/${this.user.alias}`)
    },
    handleChooseFile() {
      this.avatarCroppa.chooseFile()
    },
    async handleSubmit(formName) {
      const isValid = await this.$refs[formName].validate()
      if (!isValid) return

      console.log(this.isAvatarUpdated)
      if (this.isAvatarUpdated) {
        await this.handleSubmitWithCroppedImage()
      } else {
        await this.handleUpdateUser()
      }
    },
    async handleUpdateUser() {
      const response = await this.updateUser({
        form: this.form,
        file: this.file
      })
      if (response.status === 200) {
        this.$router.push(`/profile/${this.user.alias}`)
      } else {
        this.$message('保存できませんでした。')
      }
    },
    handleCroppaNewImageDrawn() {
      if (this.isInitialAvatar && !this.isAvatarUpdated) {
        this.isInitialAvatar = false
      } else if (!this.isInitialAvatar && !this.isAvatarUpdated) {
        this.isAvatarUpdated = true
      }
    },
    handleCroppaFileSizeExceed() {
      this.feedback =
        'ファイルサイズが超えています。2MB以内でアップロードしてください。'
    },
    handleCroppaFileTypeMismatch() {
      this.feedback =
        'ファイルタイプがサポートされていません。JPEG/PNGでアップロードしてください。'
    },
    async handleSubmitWithCroppedImage() {
      await this.avatarCroppa.generateBlob(blob => {
        this.file = blob
        this.handleUpdateUser()
      }, 'image/png')
      return this.file
    },
    ...mapActions('user', ['updateUser'])
  }
}
</script>
<style>
.croppa-container {
  background-color: transparent;
}
canvas {
  border-radius: 50%;
}
canvas:hover {
  cursor: pointer;
}
s .avatar-form {
  margin-bottom: 0;
}
.block {
  width: 100%;
}
.name {
  font-size: 1.4rem;
  font-weight: 700;
}
.extra-large-avatar {
  width: 70px;
  height: 70px;
  line-height: 70px;
}
</style>
