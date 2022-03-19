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
};
