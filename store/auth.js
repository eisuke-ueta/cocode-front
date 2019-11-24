import cloneDeep from 'lodash/cloneDeep'
import Cookies from 'js-cookie'

export const state = () => ({
  currentUser: null,
  token: null
})

export const mutations = {
  setCurrentUser(state, { currentUser }) {
    state.currentUser = currentUser
  },
  setToken(state, { token }) {
    state.token = token
  }
}

export const actions = {
  async signup({ commit, dispatch }, { form }) {
    try {
      const response = await this.$axios.post('signup', form)
      if (response && response.status === 200) {
        await Cookies.set('token', response.data.auth.token)
        await commit('setToken', { token: response.data.auth.token })
        await commit('setCurrentUser', {
          currentUser: cloneDeep(response.data.user)
        })
      } else {
        await dispatch('deleteAuth')
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async signin({ commit, dispatch }) {
    try {
      const response = await this.$axios.post('signin')
      if (response && response.status === 200) {
        await commit('setCurrentUser', {
          currentUser: cloneDeep(response.data.user)
        })
      } else {
        await dispatch('deleteAuth')
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async login({ commit, dispatch }, { form }) {
    try {
      const response = await this.$axios.post('login', form)
      if (response && response.status === 200) {
        await Cookies.set('token', response.data.auth.token)
        await commit('setToken', { token: response.data.auth.token })
        await commit('setCurrentUser', {
          currentUser: cloneDeep(response.data.user)
        })
      } else {
        await dispatch('deleteAuth')
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async logout({ commit, dispatch }) {
    try {
      const response = await this.$axios.delete('logout')
      if (response && response.status === 200) {
        await dispatch('deleteAuth')
      }
      return response
    } catch (e) {
      return e.response
    }
  },
  async updateToken({ commit }, { token }) {
    await commit('setToken', { token: token })
  },
  async deleteAuth({ commit }) {
    await Cookies.remove('token')
    await commit('setCurrentUser', { currentUser: null })
    await commit('setToken', { token: null })
  }
}
