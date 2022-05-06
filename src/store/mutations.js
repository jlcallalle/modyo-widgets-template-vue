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

  updateClientLogeo(state, payload) {
    state.mapClientLogeo = payload;
  },

  updateServicio(state, payload) {
    state.servicio = payload;
  },

  updateListarOperaciones(state, payload) {
    state.listarOperacion = payload;
  },

  updateCrearOperacionConcertada(state, payload) {
    state.crearOperacionConcertada = payload;
  },

  // Datos invex
  setListaOperaciones(state, payload) {
    state.listaOperaciones = payload;
  },
  setListaDivisas(state, payload) {
    state.listaDivisas = payload;
  },
  setCalendario(state, payload) {
    state.calendario = payload;
  },
  setQuoteRequest(state, payload) {
    state.quoteRequest = payload;
  },
  setOperacionConcertada(state, payload) {
    state.operacionConcertada = payload;
  },
  setListaOrigen(state, payload) {
    state.listaOrigen = payload;
  },
  setListaDestino(state, payload) {
    state.listaDestino = payload;
  },
  setActualizacionOperacion(state, payload) {
    state.actualizacionOperacion = payload;
  },
  setHorario(state, payload) {
    state.horario = payload;
  },
  setOperacionSeleccionada(state, payload) {
    state.operacionSeleccionada = payload;
  },
  setFechaCatalogoSeleccionada(state, payload) {
    state.fechaCatalogoSeleccionada = payload;
  },
  setTokenSeguridad(state, payload) {
    state.tokenSeguridad = payload;
  },
  setRecuperaFecha(state, payload) {
    state.recuperaFecha = payload;
  },
  setLoginData(state, payload) {
    state.userData = payload;
  },
};
