export default function({ $axios, store }) {
  $axios.onRequest(config => {
    if (store.state.auth.token) {
      config.headers.common.authorization = 'Bearer ' + store.state.auth.token
    }
  })
}
