export const state = () => ({})

export const mutations = {}

export const actions = {
  async uploadFile({ commit, dispatch }, { file }) {
    try {
      const formData = new FormData()
      if (file) formData.append('file', file)

      const response = await this.$axios.post('files/upload', formData)
      return response
    } catch (e) {
      return e.response
    }
  }
}
