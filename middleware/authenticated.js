export default ({ route, store, redirect }) => {
  if (!store.state.auth.currentUser) redirect('/')
}
