import axios from 'axios';
// import liquidParser from '../../liquid/liquidParser';

const externalApiBase = 'https://jsonplaceholder.typicode.com';
// const externalApiBase = liquidParser.parse('{{ vars.base-api-test }}');

const apiJsonPlaceholderClient = axios.create({
  baseURL: externalApiBase,
});

export default apiJsonPlaceholderClient;
