<template>
	<div id="app">
		<article data-name="v-button">
			<div class="component-divide component-desc">
				<a>
					按钮：<span>v-button</span>
					可以设置 <span>type</span> 为
					<span>default</span>
					<span>primary</span>
					<span>dashed</span>
					<span>text</span>
					共四种类型
				</a>
			</div>
			<div class="component-divide component-demo">
				<v-button>default</v-button>
				<v-button type="primary" class="mgl-20">primary</v-button>
				<v-button type="dashed" class="mgl-20">dashed</v-button>
				<v-button type="text" class="mgl-20">text</v-button>
			</div>
		</article>

		<article data-name="v-spin">
			<div class="component-divide component-desc">
				<a>
					遮罩：<span>v-spin</span>
				</a>
			</div>

			<div class="component-divide component-desc component-child-desc">
				<a>
					基础用法：
				</a>
			</div>
			<div class="spin-demo">
				<v-spin></v-spin>
			</div>

			<div class="component-divide component-desc component-child-desc">
				<a>
					尺寸：可以设置 <span>size</span> 为
					<span>small</span>
					<span>default（默认）</span>
					<span>large</span>
				</a>
			</div>
			<div class="spin-demo">
				<v-spin size="small"></v-spin>
			</div>
			<div class="spin-demo">
				<v-spin></v-spin>
			</div>
			<div class="spin-demo">
				<v-spin size="large"></v-spin>
			</div>

			<div class="component-divide component-desc component-child-desc">
				<a>
					居中固定：设置属性 <span>fix</span>
					<span>设置fix时，父元素必须设置 position: relative，或 position: absolute</span>
				</a>
			</div>
			<div class="spin-demo">
				<v-spin fix></v-spin>
			</div>

			<div class="component-divide component-desc component-child-desc">
				<a>
					自定义内容：展示自定内容需要设置属性 <span>show-text</span> 为 true
				</a>
			</div>
			<div class="spin-demo">
				<v-spin :show-text="true" fix>
					<div>
						加载中……
						<div style="margin-top: 15px">
							<v-button type="primary">返回项目</v-button>
						</div>
					</div>
				</v-spin>
			</div>

			<div class="component-divide component-desc component-child-desc">
				<a>
					全屏加载：设置 <span>fullScreen属性</span> 或 采用函数式渲染
				</a>
			</div>
			<div class="spin-demo" style="line-height: 100px">
				<v-button type="primary" @click="handleSpinShow">点击全屏加载</v-button>
			</div>
		</article>

		<arcticle data-name="v-page">
			<div class="component-divide component-desc">
				<a>
					分页插件：<span>v-page</span>
					可以设置 <span>show-elevator</span> <span>show-total</span>
					<div>
						<div class="notice-warning">
							！注意 ：暂缺 show-sizer 功能，请静待后续更新……
						</div>
					</div>
				</a>
			</div>

			<div class="component-divide component-desc component-child-desc">
				<a>
					基础用法：采用默认图标
				</a>
			</div>
			<div class="component-divide component-demo">
				<v-page :total="100" :current="2" show-elevator show-total></v-page>
			</div>

			<div class="component-divide component-desc component-child-desc">
				<a>
					自定义：通过具名插槽
					<span> v-slot : prev </span>
					<span> v-slot : next </span>
					<span> v-slot : prevJump</span>
					<span> v-slot : nextJump</span>
					使用自定义图标（推荐使用字体图标）
				</a>
			</div>
			<div class="component-divide component-demo">
				<v-page :total="100" show-elevator show-total>
					<template v-slot:prev>
						<i class="iconfont iconjiantouarrow486 page-prev-icon"></i>
					</template>
					<template v-slot:prevJump>
						<i class="iconfont iconfanhui page-prev-jump-icon"></i>
					</template>
					<template v-slot:next>
						<i class="iconfont iconjiantouarrow486 page-next-icon"></i>
					</template>
					<template v-slot:nextJump>
						<i class="iconfont iconfanhui page-next-jump-icon"></i>
					</template>
				</v-page>
			</div>

			<div class="component-divide component-desc component-child-desc">
				<a>
					简单模式：
					设置属性 <span> simple </span>
				</a>
			</div>
			<div class="component-divide component-demo">
				<v-page :total="100" :current="3" simple>
					<template v-slot:prev>
						<i class="iconfont iconjiantouarrow486 page-prev-icon"></i>
					</template>
					<template v-slot:next>
						<i class="iconfont iconjiantouarrow486 page-next-icon"></i>
					</template>
				</v-page>
			</div>
		</arcticle>
	</div>
</template>

<script>
	//Button组件
	import VButton from './components/button';
	//Spin组件
	import VSpin from './components/spin';
	//Page组件
	import VPage from './components/page';

	export default {
		components: {
			VButton,
			VSpin,
			VPage
		},
		mounted() {
		},
		methods: {
			handleSpinShow() {
				this.$Spin.show({
					render: (createDom) => {
						return createDom('div', [
							createDom('div', '加载中……'),
							createDom('button', {
								'class': 'vu-btn vu-btn-primary',
								style: {
									marginTop: '15px'
								}
							}, '这是全屏遮罩'),
						])
					}
				});
				setTimeout(() => {
					this.$Spin.hide();
				}, 3000);
			}
		}
	}
</script>

<style>
	@import url("https://at.alicdn.com/t/font_1116562_9gr44snqvsl.css");
	@import './styles/index.css';
</style>

<style scoped lang="less">
	#app {
		overflow-x: hidden;
		padding-bottom: 40px;

		.component-divide {
			padding: 0 20px;
		}

		.component-desc {
			margin-top: 40px;
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

		.component-child-desc {
			margin-top: 10px;
		}

		.component-demo {
			margin-top: 10px;
		}

		.spin-demo {
			width: 100%;
			height: 100px;
			padding: 0 20px;
			margin-top: 10px;
			position: relative;
		}

		.mgl-20 {
			margin-left: 20px;
		}

		.notice-warning {
			background-color: #fff9e6;
			color: #ffaf36;
			border-radius: 4px;
			padding: 5px 10px;
			display: inline-block;
			margin-top: 15px;
		}

		.page-prev-icon {
			transform: rotate(90deg);
			display: inline-block;
		}

		.page-prev-jump-icon {
			display: inline-block;
		}

		.page-next-icon {
			transform: rotate(270deg);
			display: inline-block;
		}

		.page-next-jump-icon {
			transform: rotate(180deg);
			display: inline-block;
		}
	}
</style>
