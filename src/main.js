import 'babel-polyfill';
import Vue from 'vue';
import Spin from './components/spin';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.prototype.$Spin = Spin;

new Vue({
	render: h => h(App)
}).$mount('#app');
