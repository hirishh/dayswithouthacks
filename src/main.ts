import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import Notifications from 'vue-notification';
import Debug from 'debug';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

const debug = Debug('dwa::main');

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.use(Notifications);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  created() {
    store.dispatch('loadArticles')
      .then(() => debug('Store: loadArticles action done.'));
  },
  render: (h) => h(App),
}).$mount('#app');
