import axios from 'axios';
import liquidParser from '../../liquid/liquidParser';

const externalApiBase = liquidParser.parse('{{ vars.urlinvexapi }}');
const tokenAuth = liquidParser.parse('{{ vars.tokeninvex }}');
const urltokeninvex = liquidParser.parse('{{ vars.urltokeninvex }}');
const invexClient = axios.create({
  baseURL: externalApiBase,
  timeout: 60000, // 60 seconds
});

const injectToken = async (config) => {
  try {
    const response = await axios.post(`${urltokeninvex}`, {
      grant_type: 'client_credentials',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${tokenAuth}`,
      },
    });
    const newConfig = config;
    newConfig.headers.authorization = `Bearer ${response.data.access_token}`;
    return newConfig;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};

invexClient.interceptors.request.use(injectToken);

invexClient.interceptors.response.use(
  (res) => res.data,
  (error) => Promise.reject(error),
);

export default invexClient;
