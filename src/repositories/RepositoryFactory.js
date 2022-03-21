import PostRepository from './PostRepository';
import ApiRepository from './ApiRepository';
import InvexRepository from './InvexRepository';
import JsonPlaceholderRepository from './JsonPlaceholderRepository';
import ListaOperacionesRepository from './ListaOperacionesRepository';

const repositories = {
  posts: PostRepository,
  api: ApiRepository,
  invex: InvexRepository,
  jsonPlaceholder: JsonPlaceholderRepository,
  listaOperaciones: ListaOperacionesRepository,
};
const RepositoryFactory = {
  get: (name) => repositories[name],
};

export default RepositoryFactory;
