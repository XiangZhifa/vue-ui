import { getScrollBarSize } from '../../utils/assist';

export default {
	props: {
		lockScroll: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		//检查是否会出现滚动条
		checkScrollBar () {
			//获取window宽度
			let fullWindowWidth = window.innerWidth;
			if (!fullWindowWidth) { // IE8以下不支持fullWindowWidth，单独进行处理
				const documentElementRect = document.documentElement.getBoundingClientRect();
				fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
			}
			//文档宽度 > window宽度，会出现滚动条
			this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
			if (this.bodyIsOverflowing) {
				//如果出现滚动条，设置滚动条宽度
				this.scrollBarWidth = getScrollBarSize();
			}
		},
		checkMaskInVisible () {
			let masks = document.getElementsByClassName('ivu-modal-mask') || [];
			//Array.some()是对数组中每一项运行给定函数，如果该函数对！！任一项！！返回true，则返回true。
			//Array.every()是对数组中每一项运行给定函数，如果该函数对！！每一项！！返回true,则返回true。
			return Array.from(masks).every(m => m.style.display === 'none' || m.classList.contains('fade-leave-to'));
		},
		setScrollBar () {
			if (this.bodyIsOverflowing && this.scrollBarWidth !== undefined) {
				document.body.style.paddingRight = `${this.scrollBarWidth}px`;
			}
		},
		resetScrollBar () {
			document.body.style.paddingRight = '';
		},
		addScrollEffect () {
			if (!this.lockScroll) return;
			this.checkScrollBar();
			this.setScrollBar();
			document.body.style.overflow = 'hidden';
		},
		removeScrollEffect() {
			if (!this.lockScroll) return;
			if (this.checkMaskInVisible()) {
				document.body.style.overflow = '';
				this.resetScrollBar();
			}
		}
	}
};
