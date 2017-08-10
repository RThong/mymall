// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from '@/util/currency'

Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(infiniteScroll);
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg'
});

Vue.filter('currency', currency);

const store = new Vuex.Store({
	state: {
		cartCount: 0
	},
	mutations: {
		updateCartCount(state, cartCount){
			state.cartCount += cartCount;
		},
		initCartCount(state, cartCount){
			state.cartCount = cartCount;
		}
	}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
