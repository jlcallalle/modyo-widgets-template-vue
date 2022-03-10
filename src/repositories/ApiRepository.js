import { apiClientServicio, apiClientOperacion } from './clients/ApiClient';

export default {
  crearServicio: (datos) => apiClientServicio.post('/todos', datos),
  crearOperacion: (datos) => apiClientOperacion.get('/events', datos),
};
