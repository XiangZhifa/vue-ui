import Modal from './confirm';

let modalInstance;

function getModalInstance(render = undefined, lockScroll = false) {
	modalInstance = modalInstance || Modal.newInstance({
		closable: false,
		maskClosable: false,
		footerHide: true,
		render: render,
		lockScroll
	});
	return modalInstance;
}

function confirm(options) {
	const render = ('render' in options) ? options.render : undefined;
	const lockScroll = ('lockScroll' in options) ? options.lockScroll : false;
	let instance = getModalInstance(render, lockScroll);
	options.onRemove = function () {
		modalInstance = null;
	};
	instance.show(options);
}

Modal.custom = function (props = {}, icon, showCancel) {
	props.icon = icon;
	props.showCancel = showCancel;
	return confirm(props);
};

Modal.remove = function () {
	if (!modalInstance) {
		return false;
	}

	const instance = getModalInstance();

	instance.remove();
};

export default Modal;