import Vue from 'vue';
import Spin from './spin.vue';

import {transferIndex, transferIncrease} from '../../utils/transfer-queue';

//设置loading遮罩需要提升的层级
function handleGetIndex() {
	transferIncrease();
	return transferIndex;
}

let tIndex = handleGetIndex();

//Spin构造函数（调用newInstance可以创建Spin实例）
Spin.newInstance = properties => {
	const _props = properties || {};

	const Instance = new Vue({
		data: Object.assign({}, _props, {}),
		render(createDom) {
			let vnode = '';
			if (this.render) {
				vnode = createDom(Spin, {
					props: {
						fix: true,
						fullscreen: true
					}
				}, [this.render(createDom)]);
			} else {
				vnode = createDom(Spin, {
					props: {
						size: 'large',
						fix: true,
						fullscreen: true
					}
				});
			}
			return createDom('div', {
				'class': 'vu-spin-fullscreen vu-spin-fullscreen-wrapper',
				'style': {
					'z-index': 2010 + tIndex
				}
			}, [vnode]);
		}
	});

	const component = Instance.$mount();
	document.body.appendChild(component.$el);
	const spin = Instance.$children[0];

	return {
		show() {
			spin.visible = true;
			tIndex = handleGetIndex();
		},
		remove(cb) {
			spin.visible = false;
			setTimeout(function () {
				spin.$parent.$destroy();
				if (document.getElementsByClassName('vu-spin-fullscreen')[0] !== undefined) {
					document.body.removeChild(document.getElementsByClassName('vu-spin-fullscreen')[0]);
				}
				cb();
			}, 500);
		},
		component: spin
	};
};

export default Spin;
