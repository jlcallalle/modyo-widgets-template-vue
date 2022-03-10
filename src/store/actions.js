import Repository from '../repositories/RepositoryFactory';

const PostRepository = Repository.get('posts');
const ApiRepository = Repository.get('api');

export default {
  async updatePage({ commit }, payload) {
    commit('updatePage', payload);
  },
  async updateServicio({ commit }, datos) {
    commit('setLoading', true);
    try {
      const response = await ApiRepository.crearServicio(datos);
      const info = response.data;
      commit('updateServicio', info);
      return response;
    } catch (error) {
      return error;
    } finally {
      commit('setLoading', false);
    }
  },
  async updateCrearOperacionConcertada({ commit }, datos) {
    commit('setLoading', true);
    try {
      const response = await ApiRepository.crearOperacion(datos);
      const infos = response.data;
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
