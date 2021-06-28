import { removeTableRowListeners } from "../fixes/tables";
import { userIsStaff, processTextNodes } from "./shared";

if (userIsStaff) {
	const container = document.querySelector("div.template.template__controls");

	if (container) {
		const config = { childList: true };

		const callback = function (mutationsList: MutationRecord[]) {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement) {
							if (node.hasAttribute("data-ajaxlookup-table")) {
								processTextNodes(node);
								removeTableRowListeners(node);
							}
						}
					});
				}
			}
		};

		const observer = new MutationObserver(callback);

		observer.observe(container, config);
	}
}
