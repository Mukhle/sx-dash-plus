import { removeTableRowListeners } from '../fixes/tables';
import { userIsStaff, processTextNodes } from './shared';

export const execute = async () => {
	if (userIsStaff) {
		const container = document.querySelector('div.template.template__controls');

		if (container) {
			const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
				for (const mutation of mutationsList) {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach((node) => {
							if (node instanceof HTMLElement) {
								if (node.hasAttribute('data-ajaxlookup-table')) {
									processTextNodes(node);
									removeTableRowListeners(node);
								}
							}
						});
					}
				}
			});

			observer.observe(container, { childList: true });
		}
	}
};

execute();
