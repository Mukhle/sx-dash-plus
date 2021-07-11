const headers = document.querySelectorAll<HTMLElement>('h3.panel-title');

export const getLookupContainerFromHeaderText = (headerText: string, getReturnValue: (element: HTMLElement) => any, defaults: any) => {
	for (const element of headers) {
		if (element.textContent?.includes(headerText)) {
			return getReturnValue(element) ?? defaults;
		}
	}

	return defaults;
};

const rgx = /STEAM_0:\d:\d+/g;
const blacklistedLookup = ['STEAM_0:1:48016748', 'STEAM_0:0:56939043'];

export function handleTextNode(textNode: Node) {
	const origText = textNode.textContent;
	const newHtml = origText?.replaceAll(rgx, (match) => {
		if (blacklistedLookup.includes(match)) {
			return match;
		}

		return `<a class='lookup-sxplus' href='https://stavox.dk/dash/lookup?lookupid=${match}'>${match}</a>`;
	});

	if (newHtml && origText && newHtml !== origText) {
		const newSpan = document.createElement('span');
		newSpan.innerHTML = newHtml;
		textNode.parentNode?.replaceChild(newSpan, textNode);
	}
}

const nodeNameSkip = ['SCRIPT', 'STYLE'];

/** Creates a tree walker, starting on the given node, and uses it to generate links on all text nodes found that contain a steamid, to the relevant lookup page. */
export function processTextNodes(start: Node) {
	const treeWalker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT, {
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

	const nodeList = [];
	while (treeWalker.nextNode()) {
		nodeList.push(treeWalker.currentNode);
	}

	nodeList.forEach(function (el) {
		handleTextNode(el);
	});
}

export const userIsStaff = (() => {
	for (const element of document.querySelectorAll('.sidebar__title')) {
		if (element.textContent == 'Staff') {
			return true;
		}
	}

	return false;
})();
