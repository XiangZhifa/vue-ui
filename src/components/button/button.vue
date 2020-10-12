<template>

</template>

<script>
	import {oneOf} from '../../utils/assist';

	//样式的统一前缀
	const prefixCls = 'vu-btn';

	export default {
		name: "button",
		props: {
			type: {
				validator(value) {
					return oneOf(value, ['default', 'primary', 'dashed', 'text', 'info', 'success', 'warning', 'error']);
				},
				default: 'default'
			},
			isHrefPattern: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			tagName() {
				return this.isHrefPattern ? 'a' : 'button';
			},
		}
	}
</script>

<style scoped>

</style>