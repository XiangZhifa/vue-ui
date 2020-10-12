<template>

</template>

<script>
	import {oneOf} from '../../utils/assist';

	const prefixCls = 'ivu-btn';

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