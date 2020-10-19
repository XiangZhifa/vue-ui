<template>
	<div v-transfer-dom :data-transfer="transfer">
		<transition :name="transitionNames[1]">
			<div :class="maskClasses" :style="wrapStyles" v-show="visible" v-if="showMask" @click="handleMask"></div>
		</transition>
		<div :class="wrapClasses" :style="wrapStyles" @click="handleWrapClick">
			<transition :name="transitionNames[0]" @after-leave="animationFinish">
				<div :class="classes" :style="mainStyles" v-show="visible" @mousedown="handleMousedown">
					<div :class="contentClasses" ref="content" :style="contentStyles" @click="handleClickModal">
						<a :class="[prefixCls + '-close']" v-if="closable" @click="close">
							<slot name="close">
								<Icon type="ios-close"></Icon>
							</slot>
						</a>
						<div :class="[prefixCls + '-header']" @mousedown="handleMoveStart" v-if="showHead">
							<slot name="header">
								<div :class="[prefixCls + '-header-inner']">{{ title }}</div>
							</slot>
						</div>
						<div :class="[prefixCls + '-body']">
							<slot></slot>
						</div>
						<div :class="[prefixCls + '-footer']" v-if="!footerHide">
							<slot name="footer">
								<i-button type="text" @click.native="cancel">取消</i-button>
								<i-button type="primary" :loading="buttonLoading" @click.native="ok">确定</i-button>
							</slot>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
	import VButton from '../button/button.vue';
	//引入自定义命令 v-transfer-dom
	import TransferDom from '../../directives/transfer-dom';
	import {transferIndex as modalIndex, transferIncrease as modalIncrease} from '../../utils/transfer-queue';
	import {on, off} from '../../utils/dom';
	import Emitter from '../../mixins/emitter';
	import ScrollbarMixins from "./mixins-scrollbar";
	import {findComponentsDownward} from '../../utils/assist';

	const prefixCls = 'vu-modal';

	export default {
		name: "modal",
		mixins: [Emitter, ScrollbarMixins],
		components: {
			VButton
		},
		directives: {TransferDom},
		props: {
			//双向绑定，判断模态框显示隐藏
			value: {
				type: Boolean,
				default: false
			},
			closable: {
				type: Boolean,
				default: true
			},
			//是否允许点击遮罩层关闭模态框
			maskClosable: {
				type: Boolean,
				default: false
			},
			title: {
				type: String
			},
			//模态框的宽度，默认520px
			width: {
				type: [Number, String],
				default: 520
			},
			okText: {
				type: String
			},
			cancelText: {
				type: String
			},
			//设置.vu-modal的样式
			styles: {
				type: Object,
				default() {
					return {};
				}
			},
			//用户自定义class，供用户自行实现部分样式
			className: {
				type: String
			},
			footerHide: {
				type: Boolean,
				default: false
			},
			scrollable: {
				type: Boolean,
				default: false
			},
			//css渐入渐出效果
			transitionNames: {
				type: Array,
				default() {
					return ['ease', 'fade'];
				}
			},
			//是否将Modal框至于Body内
			transfer: {
				type: Boolean,
				default: true
			},
			fullscreen: {
				type: Boolean,
				default: false
			},
			mask: {
				type: Boolean,
				default: true
			},
			//是否允许模态框拖拽移动，允许拖拽移动时遮罩层强制不显示
			draggable: {
				type: Boolean,
				default: false
			},
			//模态框层级
			zIndex: {
				type: Number,
				default: 1000
			},
		},
		data() {
			return {
				prefixCls: prefixCls,
				wrapShow: false,
				showHead: true,
				buttonLoading: false,
				visible: this.value,
				//拖拽的数据
				dragData: {
					x: null,
					y: null,
					dragX: null,
					dragY: null,
					dragging: false
				},
				modalIndex: this.handleGetModalIndex(),
				isMouseTriggerIn: false
			}
		},
		computed: {
			wrapClasses() {
				return [
					`${prefixCls}-wrap`,
					{
						[`${prefixCls}-hidden`]: !this.wrapShow,
						[`${this.className}`]: !!this.className,
						[`${prefixCls}-no-mask`]: !this.showMask
					}
				];
			},
			wrapStyles() {
				return {
					zIndex: this.modalIndex + this.zIndex
				};
			},
			maskClasses() {
				return `${prefixCls}-mask`;
			},
			classes() {
				return [
					`${prefixCls}`,
					{
						[`${prefixCls}-fullscreen`]: this.fullscreen,
						[`${prefixCls}-fullscreen-no-header`]: this.fullscreen && !this.showHead,
						[`${prefixCls}-fullscreen-no-footer`]: this.fullscreen && this.footerHide
					}
				];
			},
			contentClasses() {
				return [
					`${prefixCls}-content`,
					{
						[`${prefixCls}-content-no-mask`]: !this.showMask,
						[`${prefixCls}-content-drag`]: this.draggable,
						[`${prefixCls}-content-dragging`]: this.draggable && this.dragData.dragging
					}
				];
			},
			mainStyles() {
				let style = {};
				const width = parseInt(this.width);
				const styleWidth = this.dragData.x !== null ? {top: 0} : {width: width <= 100 ? `${width}%` : `${width}px`};
				//用户自定义的样式
				const customStyle = this.styles ? this.styles : {};
				Object.assign(style, styleWidth, customStyle);
				return style;
			},
			contentStyles() {
				let style = {};
				if (this.draggable) {
					const customTop = this.styles.top ? parseFloat(this.styles.top) : 0;
					const customLeft = this.styles.left ? parseFloat(this.styles.left) : 0;
					if (this.dragData.x !== null) style.left = `${this.dragData.x - customLeft}px`;
					if (this.dragData.y !== null) style.top = `${this.dragData.y}px`;
					if (this.dragData.y !== null) style.top = `${this.dragData.y - customTop}px`;
					const width = parseInt(this.width);
					const styleWidth = {
						width: width <= 100 ? `${width}%` : `${width}px`
					};
					Object.assign(style, styleWidth);
				}
				return style;
			},
			//允许拖拽移动时遮罩层强制不显示，直接返回 false
			showMask() {
				return this.draggable ? false : this.mask;
			}
		},
		methods: {
			//关闭模态框
			close() {
				this.visible = false;
				this.$emit('input', false);
				this.$emit('on-cancel');
			},
			//点击遮罩层关闭模态框
			handleMask() {
				if (this.maskClosable && this.showMask) {
					this.close();
				}
			},
			//点击vu-modal(模态框主体的 父元素)时，隐藏模态框
			handleWrapClick(event) {
				//如果鼠标在模态框主体范围内，点击不关闭模态框
				if (this.isMouseTriggerIn) {
					this.isMouseTriggerIn = false;
					return;
				}
				//使用 indexOf,不要使用 === ,因为 vu-modal-wrap 可能还有其他类名
				const className = event.target.getAttribute('class');
				if (className && className.indexOf(`${prefixCls}-wrap`) > -1) {
					return this.handleMask();
				}
			},
			//鼠标点击事件
			handleMousedown() {
				this.isMouseTriggerIn = true;
			},
			cancel() {
				this.close();
			},
			ok() {
				this.visible = false;
				this.$emit('input', false);
				this.$emit('on-ok');
			},
			EscClose(e) {
				if (this.visible && this.closable) {
					if (e.keyCode === 27) {
						const $Modals = findComponentsDownward(this.$root, 'Modal').filter(item => item.$data.visible && item.$props.closable);
						const $TopModal = $Modals.sort((a, b) => {
							return a.$data.modalIndex < b.$data.modalIndex ? 1 : -1;
						})[0];
						setTimeout(() => {
							$TopModal.close();
						}, 0);
					}
				}
			},
			//动画结束后，隐藏模态框
			animationFinish() {
				this.$emit('on-hidden');
			},
			//拖拽时的鼠标拖拽事件
			handleMoveStart(event) {
				if (!this.draggable) return false;
				//获取modal框主体
				const $content = this.$refs.content;
				//用 getBoundingClientRect 获取模态框相对于屏幕的位置
				const rect = $content.getBoundingClientRect();
				this.dragData.x = rect.x || rect.left;
				this.dragData.y = rect.y || rect.top;

				const distance = {
					x: event.clientX,
					y: event.clientY
				};
				//获取移动的距离
				this.dragData.dragX = distance.x;
				this.dragData.dragY = distance.y;

				this.dragData.dragging = true;

				on(window, 'mousemove', this.handleMoveMove);
				on(window, 'mouseup', this.handleMoveEnd);
			},

			handleMoveMove(event) {
				if (!this.dragData.dragging) return false;
				const distance = {
					x: event.clientX,
					y: event.clientY
				};
				const diff_distance = {
					x: distance.x - this.dragData.dragX,
					y: distance.y - this.dragData.dragY
				};
				this.dragData.x += diff_distance.x;
				this.dragData.y += diff_distance.y;
				this.dragData.dragX = distance.x;
				this.dragData.dragY = distance.y;
			},

			handleMoveEnd() {
				this.dragData.dragging = false;
				off(window, 'mousemove', this.handleMoveMove);
				off(window, 'mouseup', this.handleMoveEnd);
			},
			//处理modal框z-index
			handleGetModalIndex() {
				modalIncrease();
				return modalIndex;
			},

			handleClickModal() {
				if (this.draggable) {
					this.modalIndex = this.handleGetModalIndex();
				}
			},
		},
		mounted() {
			if (this.visible) {
				this.wrapShow = true;
			}

			let showHead = true;

			if (this.$slots.header === undefined && !this.title) {
				showHead = false;
			}

			this.showHead = showHead;

			// ESC close
			document.addEventListener('keydown', this.EscClose);
		},
		beforeDestroy() {
			document.removeEventListener('keydown', this.EscClose);
			this.removeScrollEffect();
		},
		watch: {
			value(val) {
				this.visible = val;
			},
			visible(val) {
				if (val === false) {
					this.buttonLoading = false;
					this.timer = setTimeout(() => {
						this.wrapShow = false;
						this.removeScrollEffect();
					}, 300);
				} else {
					this.modalIndex = this.handleGetModalIndex();

					if (this.timer) clearTimeout(this.timer);
					this.wrapShow = true;
					if (!this.scrollable) {
						this.addScrollEffect();
					}
				}
				this.broadcast('Table', 'on-visible-change', val);
				this.broadcast('Slider', 'on-visible-change', val);  // #2852
				this.$emit('on-visible-change', val);
			},
			loading(val) {
				if (!val) {
					this.buttonLoading = false;
				}
			},
			scrollable(val) {
				if (!val) {
					this.addScrollEffect();
				} else {
					this.removeScrollEffect();
				}
			},
			title(val) {
				if (this.$slots.header === undefined) {
					this.showHead = !!val;
				}
			}
		}
	}
</script>