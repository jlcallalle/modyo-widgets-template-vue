import Repository from '../repositories/RepositoryFactory';

const PostRepository = Repository.get('posts');
const ApiRepository = Repository.get('api');
const JsonPlaceholderRepository = Repository.get('jsonPlaceholder');
const ListaOperacionesRepository = Repository.get('listaOperaciones');

export default {
  async updatePage({ commit }, payload) {
    commit('updatePage', payload);
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
      console.log('lista operaciones', infos);
      commit('updateListarOperaciones', infos);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },

  // Servicio Crear Operacion Concertada
  async updateCrearOperacionConcertada({ commit }, datos) {
    commit('setLoading', true);
    try {
      const response = await ApiRepository.crearOperacion(datos);
      // const infos = response.data;
      const infos = response.data.body.operationTypeResponse.return.catalogList;
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
      console.log('aaa', response);
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
};
