const headers = document.querySelectorAll<HTMLElement>("h3.panel-title");
export const getLookupContainerFromHeaderText = (
	headerText: string,
	getReturnValue: (element: HTMLElement) => any,
	defaults: any
) => {
	for (let elt of headers) {
		if (elt.textContent?.includes(headerText)) {
			return getReturnValue(elt) ?? defaults;
		}
	}
};

const rgx = /STEAM_0:\d:\d+/g;
const blacklistedLookup = ["STEAM_0:1:48016748", "STEAM_0:0:56939043"];

export function handleTextNode(textNode: Node) {
	const origText = textNode.textContent;
	const newHtml = origText?.replaceAll(rgx, (match) => {
		if (blacklistedLookup.includes(match)) {
			return match;
		}

		return `<a class='sxpluslookup' href='https://stavox.dk/dash/lookup?lookupid=${match}'>${match}</a>`;
	});

	if (newHtml && origText && newHtml !== origText) {
		const newSpan = document.createElement("span");
		newSpan.innerHTML = newHtml;
		textNode.parentNode?.replaceChild(newSpan, textNode);
	}
}

const nodeNameSkip = ["SCRIPT", "STYLE"];
export function processDocument(start: Node) {
	let treeWalker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT, {
		acceptNode: function (node) {
			if (node.textContent?.length === 0) {
				return NodeFilter.FILTER_SKIP;
			}

			const nodeName = node.parentNode?.nodeName;
			if (nodeName && nodeNameSkip.includes(nodeName)) {
				return NodeFilter.FILTER_SKIP;
			}

			return NodeFilter.FILTER_ACCEPT;
		},
	});

	let nodeList = [];
	while (treeWalker.nextNode()) {
		nodeList.push(treeWalker.currentNode);
	}

	nodeList.forEach(function (el) {
		handleTextNode(el);
	});
}
