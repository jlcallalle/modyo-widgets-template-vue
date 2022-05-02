import Repository from '../repositories/RepositoryFactory';

const PostRepository = Repository.get('posts');
// const ApiRepository = Repository.get('api');
const JsonPlaceholderRepository = Repository.get('jsonPlaceholder');
const ListaOperacionesRepository = Repository.get('listaOperaciones');
const InvexRepository = Repository.get('invex');

export default {
  async updatePage({ commit }, payload) {
    commit('updatePage', payload);
  },

  async updateClientLogeo({ commit }, payload) {
    commit('updateClientLogeo', payload);
  },

  // Servicio Prueba
  async updateServicio({ commit }) {
    commit('setLoading', true);
    try {
      const response = await JsonPlaceholderRepository.getPost();
      const info = response.data;
      commit('updateServicio', info);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },
  // Servicio Listar Operaciones FX
  async updateListarOperaciones({ commit }) {
    commit('setLoading', true);
    try {
      const response = await ListaOperacionesRepository.getListaOpera();
      const infos = response.data.operationTypeResponseInterface.body.operationTypeResponse.return.catalogList;
      // console.log('lista operaciones', infos);
      commit('updateListarOperaciones', infos);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  // Servicio Crear Operacion Concertada
  async updateCrearOperacionConcertada({ commit }, body) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.confirmConcertacion(body);
      // const infos = response.data;
      const infos = JSON.parse(response.Message);
      // console.log('concerta vuex', infos);
      commit('updateCrearOperacionConcertada', infos);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },
  async getPosts({ commit }) {
    commit('setLoading', true);
    try {
      const response = await PostRepository.getTop(3);
      // console.log('aaa', response);
      const posts = response.entries.map((entry) => ({
        description: entry.fields.description,
        title: entry.fields.title,
        slug: entry.fields.slug,
        image: entry.fields.covers ? entry.fields.covers[0].url : '',
        imageAlt: entry.fields.covers ? entry.fields.covers[0].alt_text : '',
      }));
      commit('updatePosts', posts);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  // Datos invex
  async getListaOperaciones({ commit }) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.getOperations();
      const infos = response.operationTypeResponseInterface.body.operationTypeResponse.return.catalogList;
      commit('setListaOperaciones', [infos]);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  async getDivisas({ commit }) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.getCurrencies();
      const infos = response.CatalogList;
      commit('setListaDivisas', infos);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  async getCalendario({ commit }, currency) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.getCalendar('INVEXCOM.TEST', currency);
      const infos = JSON.parse(response.Message);
      const cal = infos.map((e) => ({
        ...e,
        date: `${e.DateValue.slice(0, 4)}-${e.DateValue.slice(4, 6)}-${e.DateValue.slice(6)}`,
      }));
      commit('setCalendario', cal);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  async getQuoteRequest({ commit }, body) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.getQuoteRequest(body);
      const infos = JSON.parse(response.Message);
      commit('setQuoteRequest', infos);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  setQuoteRequest({ commit }, body) {
    commit('setQuoteRequest', body);
  },

  // eslint-disable-next-line no-empty-pattern
  async getQuote({}, body) {
    // commit('setLoading', true);
    try {
      const response = await InvexRepository.getQuote(body.quoteId, body.opSide, body.operationName);
      // const infos = JSON.parse(response.Message);
      // commit('setQuote', infos);
      return response;
    } catch (error) {
      return error;
    } finally {
      // commit('setLoading', false);
    }
  },

  async createConcertacion({ commit }, body) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.confirmConcertacion(body);
      const infos = JSON.parse(response.Message);
      commit('updateCrearOperacionConcertada', infos);
      // commit('setOperacionConcertada', infos);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  async getListaOrigen({ commit }, body) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.listaCuentasOrigen(body);
      // console.log('responseListaOrigen', response);
      if (response) {
        const infos = response.cuentas;
        commit('setListaOrigen', infos);
      }
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  async getListaDestino({ commit }, body) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.listaCuentasDestino(body);
      // console.log('responseListaDestino', response);
      if (response) {
        const infos = response.cuentas;
        commit('setListaDestino', infos);
      }
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },
  async actualizarOperacion({ commit }, body) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.actualizarOperacion(body);
      commit('setActualizacionOperacion', response);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },
  async updateHorario({ commit }) {
    commit('setLoading', true);
    try {
      const response = await InvexRepository.getHorario();
      const infos = response;
      commit('setHorario', infos);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },
  updateOperacionSeleccionada({ commit }, operacion) {
    commit('setOperacionSeleccionada', operacion);
  },
  updateFechaCatalogoSeleccionada({ commit }, fecha) {
    commit('setFechaCatalogoSeleccionada', fecha);
  },
  async generarTokenSeguridad({ commit }, body) {
    try {
      const data = await InvexRepository.generarTokenSeguridad(body);
      commit('setTokenSeguridad', data);
      return data;
    } catch (error) {
      return error;
    }
  },
  setLoading({ commit }, loading) {
    commit('setLoading', loading);
  },
};
