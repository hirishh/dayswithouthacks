/* eslint-disable object-curly-newline */
import Vue from 'vue';
import Vuex from 'vuex';
import YAML from 'yaml';
import _ from 'lodash';
import api from '../api';

Vue.use(Vuex);

export interface Urls {
  text: string;
  link: string;
}

export interface Article {
  title: string;
  url: Array<Urls>;
  brief: string;
  when: number;
  stolen_usd: number;
  stolen_usd_str: string;
}

export interface Header {
  text: string;
  value: string;
  align?: string;
  filterable?: boolean;
}

export interface StateRoot {
  loading: boolean;
  eth: Array<Article>;
  ethUsdStolen: number;
  btc: Array<Article>;
  btcUsdStolen: number;
  headers: Array<Header>;
}

export default new Vuex.Store({
  state: {
    loading: false,
    eth: Array<Article>(),
    ethUsdStolen: 0,
    btc: Array<Article>(),
    btcUsdStolen: 0,
    headers: Array<Header>(),
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload.value;
    },
    setHeaders(state, payload) {
      if (payload.headers) {
        state.headers = payload.headers;
      }
    },
    setArticles(state, payload) {
      if (payload.eth) {
        state.eth = payload.eth;
      }
      if (payload.ethUsdStolen) {
        state.ethUsdStolen = payload.ethUsdStolen;
      }
      if (payload.btc) {
        state.btc = payload.btc;
      }
      if (payload.btcUsdStolen) {
        state.btcUsdStolen = payload.btcUsdStolen;
      }
    },
  },
  actions: {
    async loadArticles(context) {
      context.commit('setLoading', { value: true });
      const ethFile = await api.getEthArticles();
      const eth = YAML.parse(ethFile);
      const btcFile = await api.getBtcArticles();
      const btc = YAML.parse(btcFile);
      context.commit('setHeaders', {
        headers: [
          { width: '10%', text: 'When', value: 'when', filterable: false },
          { width: '15%', text: 'Title', value: 'title', align: 'start' },
          { width: '45%', text: 'Description', value: 'description', align: 'start' },
          { width: '15%', text: 'USD Equivalent', value: 'stolen_usd' },
          { width: '15%', text: 'More Info', value: 'urls', filterable: false, sortable: false },
        ],
      });
      context.commit('setArticles', {
        eth: _.orderBy(eth, ['when'], ['desc']),
        ethUsdStolen: _.sumBy(eth, (o: Article) => o.stolen_usd),
        btc: _.orderBy(btc, ['when'], ['desc']),
        btcUsdStolen: _.sumBy(btc, (o: Article) => o.stolen_usd),
      });
      context.commit('setLoading', { value: false });
    },
  },
  modules: {
  },
  strict: process.env.NODE_ENV !== 'production',
});
