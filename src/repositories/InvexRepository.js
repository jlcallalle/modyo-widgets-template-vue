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
    const operaciones = [{
      product_code: 'SPOT',
      product_description: 'SPOT',
    }];
    return new Promise((resolve) => setTimeout(() => resolve(operaciones), 10));
  },
  // eslint-disable-next-line no-unused-vars
  getCalendar(CustomerID = '', CurrencyPair = 'EUR/USD') {
    return InvexClient.post(`${prefixUrl}/Calend`, {
      CustomerID,
      CurrencyPair,
    });
  },
};
