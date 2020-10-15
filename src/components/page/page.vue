<template>
	<!--Simple模式-->
	<ul :class="simpleWrapClasses" :style="styles" v-if="simple">
		<li :class="prevClasses" @click="prev">
			<a v-if="prevSlot">
				<slot name="prev"></slot>
			</a>
			<a v-else><</a>
		</li>
		<div :class="simplePagerClasses" :title="currentPage + '/' + allPages">
			<input type="text" :value="currentPage" autocomplete="off" spellcheck="false" :disabled="disabled"
				   @keydown="keyDown" @keyup="keyUp" @change="keyUp">
			<span>/</span>
			{{ allPages }}
		</div>
		<li :class="nextClasses" @click="next">
			<a v-if="nextSlot">
				<slot name="next"></slot>
			</a>
			<a v-else>></a>
		</li>
	</ul>
	<!--标准模式-->
	<ul :class="wrapClasses" :style="styles" v-else>
        <span :class="[prefixCls + '-total']" v-if="showTotal">
            <slot>
				共 {{ total }} 条
			</slot>
        </span>
		<li :class="prevClasses" @click="prev">
			<a>
				<slot name="prev" v-if="prevSlot"></slot>
				<template v-else-if="prevText !== ''">{{ prevText }}</template>
				<a v-else> < </a>
			</a>
		</li>
		<li :class="firstPageClasses" @click="changePage(1)">
			<a>1</a>
		</li>
		<li title="向前5页" v-if="currentPage > 5" :class="[prefixCls + '-item-jump-prev']" @click="fastPrev">
			<a v-if="prevJumpSlot">
				<slot name="prevJump"></slot>
			</a>
			<a v-else> << </a>
		</li>
		<li :title="currentPage - 3" v-if="currentPage === 5" :class="[prefixCls + '-item']" @click="changePage(currentPage - 3)">
			<a>{{ currentPage - 3 }}</a>
		</li>
		<li :title="currentPage - 2" v-if="currentPage - 2 > 1" :class="[prefixCls + '-item']" @click="changePage(currentPage - 2)">
			<a>{{ currentPage - 2 }}</a>
		</li>
		<li :title="currentPage - 1" v-if="currentPage - 1 > 1" :class="[prefixCls + '-item']" @click="changePage(currentPage - 1)">
			<a>{{ currentPage - 1 }}</a>
		</li>
		<li :title="currentPage" v-if="+currentPage !== 1 && +currentPage !== +allPages"
			:class="[prefixCls + '-item',prefixCls + '-item-active']">
			<a>{{ currentPage }}</a>
		</li>
		<li :title="currentPage + 1" v-if="currentPage + 1 < allPages" :class="[prefixCls + '-item']"
			@click="changePage(currentPage + 1)">
			<a>{{ currentPage + 1 }}</a>
		</li>
		<li :title="currentPage + 2" v-if="currentPage + 2 < allPages" :class="[prefixCls + '-item']"
			@click="changePage(currentPage + 2)">
			<a>{{ currentPage + 2 }}</a>
		</li>
		<li :title="currentPage + 3" v-if="allPages - currentPage === 4" :class="[prefixCls + '-item']"
			@click="changePage(currentPage + 3)">
			<a>{{ currentPage + 3 }}</a>
		</li>
		<li title="向后5页" v-if="allPages - currentPage >= 5" :class="[prefixCls + '-item-jump-next']" @click="fastNext">
			<a v-if="nextJumpSlot">
				<slot name="nextJump"></slot>
			</a>
			<a v-else> >> </a>
		</li>
		<li :title="allPages" v-if="allPages > 1" :class="lastPageClasses" @click="changePage(allPages)">
			<a>{{ allPages }}</a>
		</li>
		<li :class="nextClasses" @click="next">
			<a>
				<slot name="next" v-if="nextSlot"></slot>
				<template v-else-if="nextText !== ''">{{ nextText }}</template>
				<a v-else> > </a>
			</a>
		</li>
		<Options :show-sizer="showSizer"
				 :page-size="currentPageSize"
				 :page-size-opts="pageSizeOpts"
				 :placement="placement"
				 :transfer="transfer"
				 :show-elevator="showElevator"
				 :_current.once="currentPage"
				 :current="currentPage"
				 :disabled="disabled"
				 :all-pages="allPages"
				 :is-small="isSmall"
				 @on-size="onSize"
				 @on-page="onPage">
		</Options>
	</ul>
</template>
<script>
	import {oneOf} from '../../utils/assist';
	import Options from './options.vue';

	const prefixCls = 'vu-page';

	export default {
		name: 'Page',
		components: {Options},
		props: {
			current: {
				type: Number,
				default: 1
			},
			total: {
				type: Number,
				default: 0
			},
			pageSize: {
				type: Number,
				default: 10
			},
			pageSizeOpts: {
				type: Array,
				default() {
					return [10, 20, 30, 40];
				}
			},
			placement: {
				validator(value) {
					return oneOf(value, ['top', 'bottom']);
				},
				default: 'bottom'
			},
			transfer: {
				type: Boolean,
				default() {
					return !this.$IVIEW || this.$IVIEW.transfer === '' ? false : this.$IVIEW.transfer;
				}
			},
			size: {
				validator(value) {
					return oneOf(value, ['small']);
				}
			},
			simple: {
				type: Boolean,
				default: false
			},
			showTotal: {
				type: Boolean,
				default: false
			},
			showElevator: {
				type: Boolean,
				default: false
			},
			showSizer: {
				type: Boolean,
				default: false
			},
			className: {
				type: String
			},
			styles: {
				type: Object
			},
			prevText: {
				type: String,
				default: ''
			},
			nextText: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				prefixCls: prefixCls,
				currentPage: this.current,
				currentPageSize: this.pageSize
			};
		},
		watch: {
			total(val) {
				let maxPage = Math.ceil(val / this.currentPageSize);
				if (maxPage < this.currentPage) {
					this.currentPage = (maxPage === 0 ? 1 : maxPage);
				}
			},
			current(val) {
				this.currentPage = val;
			},
			pageSize(val) {
				this.currentPageSize = val;
			}
		},
		computed: {
			isSmall() {
				return !!this.size;
			},
			allPages() {
				const allPage = Math.ceil(this.total / this.currentPageSize);
				return (allPage === 0) ? 1 : allPage;
			},
			simpleWrapClasses() {
				return [
					`${prefixCls}`,
					`${prefixCls}-simple`,
					{
						[`${this.className}`]: !!this.className
					}
				];
			},
			simplePagerClasses() {
				return `${prefixCls}-simple-pager`;
			},
			wrapClasses() {
				return [
					`${prefixCls}`,
					{
						[`${this.className}`]: !!this.className,
						[`${prefixCls}-with-disabled`]: this.disabled,
						'mini': !!this.size
					}
				];
			},
			prevSlot() {
				return !!this.$slots.prev&&!![...this.$slots.prev].length;
			},
			prevJumpSlot() {
				return !!this.$slots.prevJump&&!![...this.$slots.prevJump].length;
			},
			prevClasses() {
				return [
					`${prefixCls}-prev`,
					{
						[`${prefixCls}-disabled`]: this.currentPage === 1 || this.disabled,
						[`${prefixCls}-custom-text`]: this.prevText !== ''
					}
				];
			},
			nextSlot() {
				return !!this.$slots.next&&!![...this.$slots.next].length;
			},
			nextJumpSlot() {
				return !!this.$slots.nextJump&&!![...this.$slots.nextJump].length;
			},
			nextClasses() {
				return [
					`${prefixCls}-next`,
					{
						[`${prefixCls}-disabled`]: this.currentPage === this.allPages || this.disabled,
						[`${prefixCls}-custom-text`]: this.nextText !== ''
					}
				];
			},
			firstPageClasses() {
				return [
					`${prefixCls}-item`,
					{
						[`${prefixCls}-item-active`]: this.currentPage === 1
					}
				];
			},
			lastPageClasses() {
				return [
					`${prefixCls}-item`,
					{
						[`${prefixCls}-item-active`]: this.currentPage === this.allPages
					}
				];
			}
		},
		methods: {
			changePage(page) {
				if (this.disabled) return;
				if (+this.currentPage !== +page) {
					this.currentPage = page;
					this.$emit('update:current', page);
					this.$emit('current-change', page);
				}
			},
			prev() {
				if (this.disabled) return;
				const current = this.currentPage;
				if (current <= 1) {
					return false;
				}
				this.changePage(current - 1);
			},
			next() {
				if (this.disabled) return;
				const current = this.currentPage;
				if (current >= this.allPages) {
					return false;
				}
				this.changePage(current + 1);
			},
			fastPrev() {
				if (this.disabled) return;
				const page = this.currentPage - 5;
				if (page > 0) {
					this.changePage(page);
				} else {
					this.changePage(1);
				}
			},
			fastNext() {
				if (this.disabled) return;
				const page = this.currentPage + 5;
				if (page > this.allPages) {
					this.changePage(this.allPages);
				} else {
					this.changePage(page);
				}
			},
			onSize(pageSize) {
				if (this.disabled) return;
				this.currentPageSize = pageSize;
				this.$emit('size-change', pageSize);
				this.changePage(1);
			},
			onPage(page) {
				if (this.disabled) return;
				this.changePage(page);
			},
			keyDown(e) {
				const key = e.keyCode;
				const condition = (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || key === 37 || key === 39;
				if (!condition) {
					e.preventDefault();
				}
			},
			keyUp(e) {
				const key = e.keyCode;
				const val = parseInt(e.target.value);
				if (key === 38) {
					this.prev();
				} else if (key === 40) {
					this.next();
				} else if (key === 13) {
					let page = 1;
					if (val > this.allPages) {
						page = this.allPages;
					} else if (val <= 0 || !val) {
						page = 1;
					} else {
						page = val;
					}
					e.target.value = page;
					this.changePage(page);
				}
			}
		},
	};
</script>
