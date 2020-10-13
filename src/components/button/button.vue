<template>
	<component :is="tagName" :class="classes" :disabled="itemDisabled" @click="handleClickLink" v-bind="tagProps">
		<div class="vu-btn-slot" v-if="showSlot" ref="slot">
			<slot></slot>
		</div>
	</component>
</template>

<script>
	import {oneOf} from '../../utils/assist';
	import mixinsForm from '../../mixins/form';
	import mixinsLink from '../../mixins/link';

	//样式的统一前缀
	const prefixCls = 'vu-btn';

	export default {
		name: "button",
		mixins: [mixinsForm, mixinsLink],
		props: {
			type: {
				validator(value) {
					return oneOf(value, ['default', 'primary', 'dashed', 'text']);
				},
				default: 'default'
			},
			isHrefPattern: {
				type: Boolean,
				default: false
			},
			long: {
				type: Boolean,
				default: false
			},
			shape: {
				validator(value) {
					return oneOf(value, ['circle', 'circle-outline']);
				}
			},
			size: {
				validator(value) {
					return oneOf(value, ['small', 'large', 'default']);
				},
				default: 'default'
			},
			loading: Boolean,
			ghost: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			tagName() {
				return this.isHrefPattern ? 'a' : 'button';
			},

			classes() {
				return [
					`${prefixCls}`,
					`${prefixCls}-${this.type}`,
					{
						[`${prefixCls}-long`]: this.long,
						[`${prefixCls}-${this.shape}`]: !!this.shape,
						[`${prefixCls}-${this.size}`]: this.size !== 'default',
						[`${prefixCls}-loading`]: this.loading != null && this.loading,
						[`${prefixCls}-ghost`]: this.ghost
					}
				];
			},

			tagProps() {
				if (this.isHrefPattern) {
					const {linkUrl, target} = this;
					return {href: linkUrl, target};
				} else {
					const {htmlType} = this;
					return {type: htmlType};
				}
			},

			showSlot() {
				console.log(this.$slots);
				return !!this.$slots.default;
			},
		},
		methods: {
			handleClickLink(event) {
				this.$emit('click', event);
				const openInNewWindow = event.ctrlKey || event.metaKey;
				this.handleCheckClick(event, openInNewWindow);
			}
		}
	}
</script>

<style>
	@import "../../styles/components/button.css";
</style>