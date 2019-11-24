import cookieparser from 'cookieparser'

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    try {
      if (req.headers.cookie) {
        const cookie = cookieparser.parse(req.headers.cookie)
        if (cookie.token) {
          await dispatch('auth/updateToken', { token: cookie.token })
          await dispatch('auth/signin')
        }
      }
    } catch (e) {
      if (e.response && e.response.status === 401) {
        await dispatch('auth/deleteAuth')
      }
    }
  }
}
