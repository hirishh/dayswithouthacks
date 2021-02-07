import axios, { Method, AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import EventSource from 'eventsource';

const { hostname } = window.location;
const port = process.env.VUE_APP_SRV_PORT || 3000;

let baseUrl = `http://${hostname}:${port}`;
let urlApi = `http://${hostname}:${port}/api`;
if (process.env.NODE_ENV === 'production') {
  baseUrl = '/';
  urlApi = '/api';
}

const clientBase = axios.create({
  baseURL: baseUrl,
  responseType: 'text',
});

const clientApi = axios.create({
  baseURL: urlApi,
  responseType: 'json',
});

const executeBase = (method: Method, resource: string, data?: {}) => clientBase(
  { method, url: resource, data },
).then((req: { data: string }) => req.data);

const executeApi = (
  method: Method,
  url: string,
  data?: unknown,
  moreConfig?: AxiosRequestConfig,
) => {
  let config = { method, url, data };
  if (moreConfig) {
    config = _.assign(config, moreConfig);
  }
  return clientApi(config).then((req: { data: {} }) => req.data);
};

export default {
  async getEthArticles() {
    return executeBase('GET', '/eth.yaml');
  },
  async getBtcArticles() {
    return executeBase('GET', '/btc.yaml');
  },

  /**
   * Telegram API
   */
  async sendTelegramMessage(message: string) {
    return executeApi('POST', '/contact', { message });
  },

  /**
   * LND Api
   */
  async createInvoice(value: number, memo: string) {
    return executeApi('POST', '/lnd/createInvoice', { value, memo });
  },
  async checkSettled(rHashStr: string) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    return executeApi('GET', '/lnd/checkSettled', null, { params: { r_hash_str: rHashStr } });
  },
  createListenSettledESS(rHashStr: string): EventSource {
    return new EventSource(`${urlApi}/lnd/listenSettled?r_hash_str=${rHashStr}`);
  },
};
