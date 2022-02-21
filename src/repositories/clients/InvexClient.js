import axios from 'axios';
import liquidParser from '../../liquid/liquidParser';

const externalApiBase = liquidParser.parse('{{ vars.url_invex_api }}');
const invexClient = axios.create({
  baseURL: externalApiBase,
  timeout: 60000, // 60 seconds
});

invexClient.interceptors.response.use(
  (res) => res.data,
  (error) => Promise.reject(error),
);

export default invexClient;
