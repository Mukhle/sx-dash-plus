if (processDocument) {
	const config = { childList: true };

	const callback = function (mutationsList) {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList") {
				mutation.addedNodes?.forEach((element) => {
					if (element.hasAttribute("data-ajaxlookup-table")) {
						processDocument(element);
					}
				});
			}
		}
	};

	const observer = new MutationObserver(callback);

	observer.observe(document, config);
}
