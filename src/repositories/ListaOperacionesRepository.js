import ApiListaOperacionesClient from './clients/ListaOperacionesClient';

export default {
  getListaOpera() {
    return ApiListaOperacionesClient.get('/portal/1.0.0/lista-operaciones?transactionId=asdasda&requestSystem=PORTALFX&network=FX');
  },
};
