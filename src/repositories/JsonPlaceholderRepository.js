import ApiJsonPlaceholderClient from './clients/JsonPlaceholderClient';

export default {
  getPost() {
    return ApiJsonPlaceholderClient.get('/users/1/posts');
  },
  getAlbums() {
    return ApiJsonPlaceholderClient.get('/users/1/albums');
  },
  getComments() {
    return ApiJsonPlaceholderClient.get('/users/1/comments');
  },
};
