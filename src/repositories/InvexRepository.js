// eslint-disable-next-line no-unused-vars
import InvexClient from './clients/InvexClient';

const prefixUrl = '/portal/1.0.0';

export default {
  // eslint-disable-next-line no-unused-vars
  getCurrencies(transactionId, requestSystem) {
    return InvexClient.get(`${prefixUrl}/listado-divisas`);
  },
  // eslint-disable-next-line no-unused-vars
  getOperations(network = 'FX') {
    return InvexClient.get(`${prefixUrl}/lista-operaciones?network=${network}`);
  },
  // eslint-disable-next-line no-unused-vars
  getCalendar(CustomerID = '', CurrencyPair = 'EUR/USD') {
    return InvexClient.post(`${prefixUrl}/Calend`, {
      CustomerID,
      CurrencyPair,
    });
  },
  getQuoteRequest(body) {
    return InvexClient.post(`${prefixUrl}/quoterequest`, body);
  },
  getQuote(quoteId, opSide, operationName = 'SPOT') {
    return InvexClient.get(
      `${prefixUrl}/quote?QuoteReqID=${quoteId}&OperationSide=${opSide}&OperationName=${operationName}`,
    );
  },
  registrarOperacion(body) {
    return InvexClient.post(`${prefixUrl}/registrar-operacion`, body);
  },
  confirmConcertacion(body) {
    return InvexClient.post(`${prefixUrl}/confirmacion-concertacion`, body);
  },
  listaCuentasDestino(body) {
    return InvexClient.post(`${prefixUrl}/listaCuentasDestino`, body);
  },
  listaCuentasOrigen(body) {
    return InvexClient.post(`${prefixUrl}/lista_cuentas_origen`, body);
  },
  actualizarOperacion(body) {
    return InvexClient.post(`${prefixUrl}/actualizarOperacion`, body);
  },
  getHorario() {
    return InvexClient.get(`${prefixUrl}/validate-services`);
  },
  generarTokenSeguridad(body) {
    return InvexClient.post(`${prefixUrl}/generaTokenSeguridad`, body);
  },
  recuperaFecha(body) {
    return InvexClient.post(`${prefixUrl}/recuperaFecha`, body);
  },
  validarToken(body) {
    return InvexClient.post(`${prefixUrl}/validarToken`, body);
  },
  fechapataCortapataLarga(body) {
    return InvexClient.post(`${prefixUrl}/pataCortapataLarga`, body);
  },
};
