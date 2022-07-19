import axios from 'axios';
import liquidParser from '../../liquid/liquidParser';

const externalApiBase = liquidParser.parse('{{ vars.urlinvexapi }}');
const tokenAuth = liquidParser.parse('{{ vars.tokeninvex }}');
const urltokeninvex = liquidParser.parse('{{ vars.urltokeninvex }}');
const invexClient = axios.create({
  baseURL: externalApiBase,
  timeout: 60000, // 60 seconds
});

const handleTimeExpiration = (timeToExpire, tkn) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + timeToExpire);
  localStorage.setItem('tokenExpirationDate', date);
  localStorage.setItem('tkn', tkn);
};

const isExpired = () => {
  const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
  if (tokenExpirationDate !== null) {
    const date = new Date(tokenExpirationDate);
    return new Date() > date;
  }
  return true;
};

const injectToken = async (config) => {
  if (isExpired()) {
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
      handleTimeExpiration(response.data.expires_in, response.data.access_token);
      const newConfig = config;
      newConfig.headers.authorization = `Bearer ${response.data.access_token}`;
      return newConfig;
    } catch (error) {
      throw new Error('Unauthorized');
    }
  } else {
    const newConfig = config;
    newConfig.headers.authorization = `Bearer ${localStorage.getItem('tkn')}`;
    return newConfig;
  }
};

invexClient.interceptors.request.use(injectToken);

invexClient.interceptors.response.use(
  (res) => res.data,
  (error) => Promise.reject(error),
);

export default invexClient;
