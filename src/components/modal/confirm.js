import Vue from 'vue';
import Modal from './modal.vue';
import Button from '../button/button.vue';

const prefixCls = 'vu-modal-confirm';

Modal.newInstance = properties => {
	const _props = properties || {};

	const Instance = new Vue({
		data: Object.assign({}, _props, {
			visible: false,
			width: 416,
			title: '',
			body: '',
			iconType: '',
			iconName: '',
			okText: undefined,
			cancelText: undefined,
			showCancel: false,
			loading: false,
			buttonLoading: false,
			scrollable: false,
			closable: false,
			closing: false // 关闭有动画，期间使用此属性避免重复点击
		}),
		render(h) {
			let footerVNodes = [];
			//取消按钮 和 确认按钮
			if (this.showCancel) {
				footerVNodes.push(h(Button, {
					props: {
						type: 'text'
					},
					on: {
						click: this.cancel
					}
				}, '取消'));
			}
			footerVNodes.push(h(Button, {
				props: {
					type: 'primary',
				},
				on: {
					click: this.ok
				}
			}, '确定'));

			let body_render;
			//创建确认框body
			if (this.render) {
				body_render = h('div', {
					attrs: {
						class: `${prefixCls}-body ${prefixCls}-body-render`
					}
				}, [this.render(h)]);
			} else {
				body_render = h('div', {
					attrs: {
						class: `${prefixCls}-body`
					}
				}, [
					h('div', {
						domProps: {
							innerHTML: this.body
						}
					})
				]);
			}

			let head_render;
			//确认框的header，如果没有头部内容，隐藏header
			if (this.title) {
				head_render = h('div', {
					attrs: {
						class: `${prefixCls}-head`
					}
				}, [
					h('div', {
						class: this.iconTypeCls
					}, [
						h('i', {
							class: this.iconNameCls
						})
					]),
					h('div', {
						attrs: {
							class: `${prefixCls}-head-title`
						},
						domProps: {
							innerHTML: this.title
						}
					})
				]);
			}

			return h(Modal, {
				props: Object.assign({}, _props, {
					width: this.width,
					scrollable: this.scrollable,
					closable: this.closable
				}),
				domProps: {
					value: this.visible
				},
				on: {
					input: (status) => {
						this.visible = status;
					},
					'on-cancel': this.cancel
				}
			}, [
				h('div', {
					attrs: {
						class: prefixCls
					}
				}, [
					head_render,
					body_render,
					h('div', {
						attrs: {
							class: `${prefixCls}-footer`
						}
					}, footerVNodes)
				])
			]);
		},
		computed: {
			iconTypeCls() {
				return [
					`${prefixCls}-head-icon`,
					`${prefixCls}-head-icon-${this.iconType}`
				];
			},
			iconNameCls() {
				return [
					'vu-icon',
					`vu-icon-${this.iconName}`
				];
			},
		},
		methods: {
			cancel() {
				if (this.closing) return;
				this.$children[0].visible = false;
				this.onCancel();
				this.remove();
			},
			ok() {
				if (this.closing) return;
				this.$children[0].visible = false;
				this.remove();
				this.onOk();
			},
			remove() {
				this.closing = true;
				setTimeout(() => {
					this.closing = false;
					this.destroy();
				}, 300);
			},
			destroy() {
				this.$destroy();
				if (this.$el) document.body.removeChild(this.$el);
				this.onRemove();
			},
			onOk() {
			},
			onCancel() {
			},
			onRemove() {
			}
		}
	});

	const component = Instance.$mount();
	document.body.appendChild(component.$el);
	const modal = Instance.$children[0];

	return {
		show(props) {
			modal.$parent.showCancel = props.showCancel;
			//判断是否存在用户传入的定制化参数
			if ('width' in props) {
				modal.$parent.width = props.width;
			}

			if ('closable' in props) {
				modal.$parent.closable = props.closable;
			}

			if ('title' in props) {
				modal.$parent.title = props.title;
			}

			if ('content' in props) {
				modal.$parent.body = props.content;
			}

			if ('okText' in props) {
				modal.$parent.okText = props.okText;
			}

			if ('cancelText' in props) {
				modal.$parent.cancelText = props.cancelText;
			}

			if ('onCancel' in props) {
				modal.$parent.onCancel = props.onCancel;
			}

			if ('onOk' in props) {
				modal.$parent.onOk = props.onOk;
			}

			if ('scrollable' in props) {
				modal.$parent.scrollable = props.scrollable;
			}

			modal.$parent.onRemove = props.onRemove;

			modal.visible = true;
		},
		remove() {
			modal.visible = false;
			modal.$parent.buttonLoading = false;
			modal.$parent.remove();
		},
		component: modal
	}
};

export default Modal;

