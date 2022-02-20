import InvexClient from './clients/InvexClient';

export default {
  getCurrencies() {
    return InvexClient.get('/routes/currencies');
  },
};
