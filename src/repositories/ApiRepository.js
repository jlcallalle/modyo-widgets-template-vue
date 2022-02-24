import { apiClientServicio } from './clients/ApiClient';

export default {
  crearServicio: (datos) => apiClientServicio.post('/todos', datos),
};
