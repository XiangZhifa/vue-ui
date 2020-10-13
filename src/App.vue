<template>
	<div id="app">
		<div class="component-divide component-desc">
			<a>
				按钮：可以设置type为
				<span>default</span>
				<span>primary</span>
				<span>dashed</span>
				<span>text</span>
				共四种类型
			</a>
		</div>
		<div class="component-divide">
			<v-button>default</v-button>
			<v-button type="primary" class="mgl-20">primary</v-button>
			<v-button type="dashed" class="mgl-20">dashed</v-button>
			<v-button type="text" class="mgl-20">text</v-button>
		</div>
	</div>
</template>

<script>
	//Button组件
	import VButton from './components/button';

	export default {
		components: {
			VButton
		},
		mounted() {
		},
		methods: {
		}
	}
</script>

<style scoped lang="less">
	.component-divide {
		margin-top: 20px;
		padding: 0 20px;
	}

	.component-desc a {
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1, Arial, sans-serif;
		font-size: 14px;
		line-height: 1.5;
		color: #515a6e;
	}

	.component-desc span {
		background-color: #fff5f5;
		color: #fa795e;
		border-radius: 4px;
		margin-left: 10px;
		padding: 5px 10px;
	}

	.mgl-20 {
		margin-left: 20px;
	}
</style>
