import 'babel-polyfill';
import Vue from 'vue';
import Spin from './components/spin';
import Modal from './components/modal';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.prototype.$Spin = Spin;
Vue.prototype.$Modal = Modal;

new Vue({
	render: h => h(App)
}).$mount('#app');
