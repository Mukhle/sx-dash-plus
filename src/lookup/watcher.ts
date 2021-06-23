import { removeTableRowListeners } from "../fixes/tables";
import { processDocument } from "./shared";
import user_is_staff from "../staffcheck";

if (user_is_staff) {
	const container = document.querySelector("div.template.template__controls");

	if (container) {
		const config = { childList: true };

		const callback = function (mutationsList: MutationRecord[]) {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement) {
							if (node.hasAttribute("data-ajaxlookup-table")) {
								processDocument(node);
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
