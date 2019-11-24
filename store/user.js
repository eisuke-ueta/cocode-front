import cloneDeep from 'lodash/cloneDeep'

export const state = () => ({
  user: null,
  users: []
})

export const mutations = {
  setUser(state, { user }) {
    state.user = user
  },
  setUsers(state, { users }) {
    state.users = users
  }
}

export const actions = {
  async getUser({ commit }, { id }) {
    try {
      const response = await this.$axios.get(`users/${id}`)
      if (response && response.status === 200) {
        await commit('setUser', { user: cloneDeep(response.data.user) })
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async getUserByAlias({ commit }, { alias }) {
    try {
      const response = await this.$axios.get(`users/alias/${alias}`)
      if (response && response.status === 200) {
        await commit('setUser', { user: cloneDeep(response.data.user) })
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async updateUser({ commit }, { form, file }) {
    try {
      const formData = new FormData()
      const fields = JSON.stringify({
        id: form.id,
        name: form.name,
        biography: form.biography
      })
      if (fields) formData.append('fields', fields)
      if (file) formData.append('file', file)

      const response = await this.$axios.post('users/update', formData)
      if (response && response.status === 200) {
        await commit('setUser', { user: cloneDeep(response.data.user) })
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async deleteUser({ commit }, { id }) {
    try {
      const response = await this.$axios.delete(`users/delete/${id}`)
      if (response && response.status === 200) {
        await commit('setUser', { user: null })
      }
    } catch (e) {
      return e.response
    }
  },
  async getUsers({ commit }, { offset, limit }) {
    try {
      const query = 'offset=' + offset + '&limit=' + limit
      const response = await this.$axios.get(`users?${query}`)
      if (response && response.status === 200) {
        const newUsers = response.data.users.map(user => cloneDeep(user))
        await commit('setUsers', { users: newUsers })
      }
      return response
    } catch (e) {
      return e.response
    }
  }
}
