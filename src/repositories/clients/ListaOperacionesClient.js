import axios from 'axios';
import liquidParser from '../../liquid/liquidParser';

// const externalApiBase = 'https://jsonplaceholder.typicode.com';
const externalApiBase = liquidParser.parse('{{ vars.urlinvexapi }}');
const tokenAuth = liquidParser.parse('{{ vars.tokeninvex }}');
const urltokeninvex = liquidParser.parse('{{ vars.urltokeninvex }}');

const apiListaOperacionesClient = axios.create({
  baseURL: externalApiBase,
});

const injectToken = async (config) => {
  try {
    const params = {
      grant_type: 'client_credentials',
    };
    const data = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    const response = await axios.post(`${urltokeninvex}`, data, {
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

apiListaOperacionesClient.interceptors.request.use(injectToken);

export default apiListaOperacionesClient;
