import { apiClientServicio, apiClientOperacion, apiClientListaOperacion } from './clients/ApiClient';

export default {
  crearServicio: (datos) => apiClientServicio.post('/todos', datos),
  crearOperacion: (datos) => apiClientOperacion.get('/events', datos),
  listaOperacion: (datos) => apiClientListaOperacion.get('/operationTypeResponseInterface', datos),
};
