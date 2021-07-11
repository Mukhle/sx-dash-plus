const unbind_event_listeners = (node: HTMLElement) => {
	node.parentNode?.replaceChild(node.cloneNode(true), node);
};

export function removeTableRowListeners(root: HTMLElement) {
	for (const element of root.querySelectorAll<HTMLTableRowElement>('.table > tbody > tr')) {
		element.classList.add('row-sxplus');
		element.removeAttribute('onclick');
		unbind_event_listeners(element);
	}
}

export const execute = async () => {
	removeTableRowListeners(document.documentElement);
};

execute();
