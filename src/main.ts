import Vue from 'vue'
import App from './App.vue'
import store from './store'
import moment from 'moment'
import socketio from 'socket.io-client'
import VueSocketIO from "vue-socket.io";


Vue.config.productionTip = false;

const options = {
	transportOptions: {
		polling: {
			extraHeaders: {
				'Access-Control-Allow-Origin':'*',
				'Access-Control-Allow-Methods': 'GET , POST'
			}
		}
	},
	// Такой вариант тоже пробовал
	// extraHeaders: {
	//   Authorization: `Bearer ${token}`
	// }
};

// Vue.use(new VueSocketIO({
// 	debug: false,
// 	connection: socketio('http://localhost:8095',{transportOptions: {
// 	polling: {
// 		extraHeaders: {
// 			'Access-Control-Allow-Origin':'http://localhost:8095/',
// 				'Access-Control-Allow-Methods': 'GET , POST'
// 		}
// 	}
// 	}
// })
// }),store);


Vue.filter('formatDate',  (value: number) => {
	if (value) {
		return moment(value).format('MM/DD/YYYY hh:mm:ss')
	}
});

new Vue({
	store,
	render: h => h(App)
}).$mount('#app');
