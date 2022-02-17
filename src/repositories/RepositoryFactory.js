import PostRepository from './PostRepository';
import ApiRepository from './ApiRepository';
import InvexRepository from './InvexRepository';

const repositories = {
  posts: PostRepository,
  api: ApiRepository,
  invex: InvexRepository,
};
const RepositoryFactory = {
  get: (name) => repositories[name],
};

export default RepositoryFactory;
