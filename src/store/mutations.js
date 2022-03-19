export default {
  setLoading(state, payload) {
    state.loading = payload;
  },

  updatePosts(state, payload) {
    state.posts = payload;
  },

  updatePage(state, payload) {
    state.currentView = payload;
  },

  updateServicio(state, payload) {
    state.servicio = payload;
  },

  updateCrearOperacionConcertada(state, payload) {
    state.crearOperacionConcertada = payload;
  },

  updateListarOperacionConcertada(state, payload) {
    state.listarOperacionConcertada = payload;
  },

};
