import Vue from 'vue';

const isServer = Vue.prototype.$isServer;

// 判断参数是否是其中之一
export function oneOf(value, validList) {
	for (let i = 0; i < validList.length; i++) {
		if (value === validList[i]) {
			return true;
		}
	}
	return false;
}


let cached;
//  获取浏览器滚动条的实际宽度
export function getScrollBarSize(fresh) {
	//暂未用到不做解读
	if (isServer) return 0;
	if (fresh || cached === undefined) {
		//创建内层div，高度200px，宽度100%
		const inner = document.createElement('div');
		inner.style.width = '100%';
		inner.style.height = '200px';

		//创建外层div
		const outer = document.createElement('div');
		//获取outer的style对象后，设置outer样式
		const outerStyle = outer.style;
		outerStyle.position = 'absolute';
		outerStyle.top = 0;
		outerStyle.left = 0;
		outerStyle.pointerEvents = 'none';
		outerStyle.visibility = 'hidden';
		outerStyle.width = '200px';
		outerStyle.height = '150px';
		outerStyle.overflow = 'hidden';

		outer.appendChild(inner);

		document.body.appendChild(outer);

		//widthContained 滚动条出现前内容宽度
		const widthContained = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		//widthScroll 滚动条出现后内容宽度（此时！！如果！！滚动条出现，内容宽度被挤压，会变小）
		let widthScroll = inner.offsetWidth;

		if (widthContained === widthScroll) {
			widthScroll = outer.clientWidth;
		}

		document.body.removeChild(outer);

		//滚动条出现前、后宽度相减，得到此时浏览器滚动条的实际宽度
		cached = widthContained - widthScroll;
	}
	return cached;
}

export function findComponentsDownward (context, componentName) {
	return context.$children.reduce((components, child) => {
		if (child.$options.name === componentName) components.push(child);
		const foundChilds = findComponentsDownward(child, componentName);
		return components.concat(foundChilds);
	}, []);
}