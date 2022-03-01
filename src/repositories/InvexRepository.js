// eslint-disable-next-line no-unused-vars
import InvexClient from './clients/InvexClient';

export default {
  // eslint-disable-next-line no-unused-vars
  getCurrencies(transactionId, requestSystem) {
    const divisas = {
      catalogList: [
        {
          ccy1: 'USD',
          ccy2: 'MXN',
        },
        {
          ccy1: 'EUR',
          ccy2: 'USD',
        },
        {
          ccy1: 'EUR',
          ccy2: 'MXN',
        },
        {
          ccy1: 'USD',
          ccy2: 'JPY',
        },
      ],
    };
    return new Promise((resolve) => setTimeout(() => resolve(divisas), 10));
    // return InvexClient.get('/routes/currencies');
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
  getCalendar(CustomerID, CurrencyPair) {
    const calendar = {
      DataIdentifier: '6',
      Message: [
        {
          DateValue: '20220209',
          Description: 'TODAY',
        },
        {
          DateValue: '20220210',
          Description: 'TOMORROW',
        },
        {
          DateValue: '20220211',
          Description: 'SPOT',
        },
        {
          DateValue: '20220214',
          Description: 'SPOTNEXT',
        },
        {
          DateValue: '20220218',
          Description: '1 WEEK',
        },
        {
          DateValue: '20220225',
          Description: '2 WEEKS',
        },
        {
          DateValue: '20220304',
          Description: '3 WEEKS',
        },
        {
          DateValue: '20220311',
          Description: '1 MONTH',
        },
        {
          DateValue: '20220411',
          Description: '2 MONTHS',
        },
        {
          DateValue: '20220511',
          Description: '3 MONTHS',
        },
        {
          DateValue: '20220613',
          Description: '4 MONTHS',
        },
        {
          DateValue: '20220711',
          Description: '5 MONTHS',
        },
        {
          DateValue: '20220811',
          Description: '6 MONTHS',
        },
        {
          DateValue: '20220912',
          Description: '7 MONTHS',
        },
        {
          DateValue: '20221011',
          Description: '8 MONTHS',
        },
        {
          DateValue: '20221114',
          Description: '9 MONTHS',
        },
        {
          DateValue: '20221212',
          Description: '10 MONTHS',
        },
        {
          DateValue: '20230111',
          Description: '11 MONTHS',
        },
        {
          DateValue: '20230213',
          Description: '1 YEAR',
        },
        {
          DateValue: '20230811',
          Description: '18 MONTHS',
        },
        {
          DateValue: '20240212',
          Description: '2 YEARS',
        },
        {
          DateValue: '20250211',
          Description: '3 YEARS',
        },
        {
          DateValue: '20270211',
          Description: '5 YEARS',
        },
        {
          DateValue: '20220316',
          Description: 'MAR IMM',
        },
        {
          DateValue: '20220615',
          Description: 'JUN IMM',
        },
        {
          DateValue: '20220921',
          Description: 'SEP IMM',
        },
        {
          DateValue: '20221221',
          Description: 'DEC IMM',
        },
      ],
    };
    return new Promise((resolve) => setTimeout(() => resolve(calendar), 10));
  },
};
