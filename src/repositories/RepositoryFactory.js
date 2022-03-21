import PostRepository from './PostRepository';
import ApiRepository from './ApiRepository';
import InvexRepository from './InvexRepository';
import JsonPlaceholderRepository from './JsonPlaceholderRepository';

const repositories = {
  posts: PostRepository,
  api: ApiRepository,
  invex: InvexRepository,
  jsonPlaceholder: JsonPlaceholderRepository,
};
const RepositoryFactory = {
  get: (name) => repositories[name],
};

export default RepositoryFactory;
