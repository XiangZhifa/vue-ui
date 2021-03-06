<template>
	<transition name="fade">
		<div :class="classes" v-if="fullscreenVisible">
			<div :class="mainClasses">
				<span :class="dotClasses"></span>
				<div :class="textClasses">
					<slot></slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import {oneOf} from '../../utils/assist';
	import ScrollbarMixins from '../modal/mixins-scrollbar';

	const prefixCls = 'vu-spin';

	export default {
		name: "spin",
		mixins: [ScrollbarMixins],
		props: {
			size: {
				validator(value) {
					return oneOf(value, ['small', 'large', 'default']);
				},
				default: 'default'
			},
			fix: {
				type: Boolean,
				default: false
			},
			fullscreen: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				visible: false,
				showText: false,
			};
		},
		computed: {
			classes() {
				return [
					`${prefixCls}`,
					{
						[`${prefixCls}-${this.size}`]: !!this.size,
						[`${prefixCls}-fix`]: this.fix,
						[`${prefixCls}-show-text`]: this.showText,
						[`${prefixCls}-fullscreen`]: this.fullscreen
					}
				];
			},
			mainClasses() {
				return `${prefixCls}-main`;
			},
			dotClasses() {
				return `${prefixCls}-dot`;
			},
			textClasses() {
				return `${prefixCls}-text`;
			},
			fullscreenVisible() {
				if (this.fullscreen) {
					return this.visible;
				} else {
					return true;
				}
			}
		},
		mounted () {
			this.showText = this.$slots.default !== undefined;
		},
		watch: {
			visible(val) {
				if (val) {
					this.addScrollEffect();
				} else {
					this.removeScrollEffect();
				}
			}
		},
	}
</script>