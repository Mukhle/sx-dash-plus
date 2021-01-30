if (user_is_staff) {
	const rgx = /STEAM_0:\d:\d+/g;
	const blacklistedLookup = ["STEAM_0:1:48016748", "STEAM_0:0:56939043"];

	function handleTextNode(textNode) {
		let origText = textNode.textContent;
		let newHtml = origText.replaceAll(rgx, (match) => {
			if (blacklistedLookup.includes(match)) {
				return match;
			}

			return `<a class="sxpluslookup" href="https://stavox.dk/dash/lookup?lookupid=${match}">${match}</a>`;
		});

		if (newHtml !== origText) {
			let newSpan = document.createElement("span");
			newSpan.innerHTML = newHtml;
			textNode.parentNode.replaceChild(newSpan, textNode);
		}
	}

	const nodeNameSkip = ["SCRIPT", "STYLE"];
	function processDocument(start) {
		let treeWalker = document.createTreeWalker(
			start,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: function (node) {
					if (node.textContent.length === 0) {
						return NodeFilter.FILTER_SKIP;
					}

					if (nodeNameSkip.includes(node.parentNode.nodeName)) {
						return NodeFilter.FILTER_SKIP;
					}

					return NodeFilter.FILTER_ACCEPT;
				},
			},
			false
		);

		let nodeList = [];
		while (treeWalker.nextNode()) {
			nodeList.push(treeWalker.currentNode);
		}

		nodeList.forEach(function (el) {
			handleTextNode(el);
		});
	}

	processDocument(document.body);
}
