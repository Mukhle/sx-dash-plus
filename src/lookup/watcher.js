if (user_is_staff) {
	const container = document.querySelector("div.template.template__controls");

	if (container) {
		const config = { childList: true };

		const callback = function (mutationsList) {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					console.log(mutation.addedNodes);
					mutation.addedNodes?.forEach((element) => {
						if (element.hasAttribute("data-ajaxlookup-table")) {
							processDocument(element);
							removeTableRowListeners(element);
						}
					});
				}
			}
		};

		const observer = new MutationObserver(callback);

		observer.observe(container, config);
	}
}
