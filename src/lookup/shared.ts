import { blacklistedLookupSteamIDs, regexSteamID } from '../shared'

export function getLookupContainerFromHeaderText<R, D>(headerText: string, getReturnValue: (element: HTMLElement) => R | undefined, defaults: D): R | D {
	const headers = document.querySelectorAll<HTMLElement>('h3.panel-title')

	for (const element of headers) {
		if (element.textContent?.includes(headerText)) {
			const returnValue = getReturnValue(element)

			if (returnValue) {
				return returnValue
			}
		}
	}

	return defaults
}

export function handleTextNode(textNode: Node): void {
	const origText = textNode.textContent
	if (origText === null) return

	const element = textNode.parentElement
	if (element === null) return

	if (element instanceof HTMLAnchorElement) {
		if (element.classList.contains('convertedlink')) {
			const elementContent = element.textContent
			if (elementContent === null) return

			if (blacklistedLookupSteamIDs.includes(elementContent)) {
				element.replaceWith(elementContent)

				return
			}

			element.classList.remove('convertedlink')
			element.classList.add('lookup-sxplus')

			return
		}
	}

	const newHtml = origText.replaceAll(regexSteamID, (match) => {
		if (blacklistedLookupSteamIDs.includes(match)) {
			return match
		}

		return `<a class="lookup-sxplus" href="https://stavox.dk/dash/lookup?lookupid=${match}">${match}</a>`
	})

	if (newHtml === origText) return

	const newSpan = document.createElement('span')
	newSpan.innerHTML = newHtml

	element.replaceChild(newSpan, textNode)
}

const nodeNameSkip = ['SCRIPT', 'STYLE']

/** Creates a tree walker, starting on the given node, and uses it to generate links on all text nodes found that contain a steamid, to the relevant lookup page. */
export function processTextNodes(start: Node): void {
	const treeWalker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT, {
		'acceptNode': function (node) {
			if (node.textContent?.length === 0) {
				return NodeFilter.FILTER_SKIP
			}

			const nodeName = node.parentNode?.nodeName
			if (nodeName && nodeNameSkip.includes(nodeName)) {
				return NodeFilter.FILTER_SKIP
			}

			return NodeFilter.FILTER_ACCEPT
		},
	})

	const nodeList = []
	while (treeWalker.nextNode()) {
		nodeList.push(treeWalker.currentNode)
	}

	nodeList.forEach(function (el) {
		handleTextNode(el)
	})
}

export const userIsStaff = (() => {
	for (const element of document.querySelectorAll('.sidebar__title')) {
		if (element.textContent == ' Staff') {
			return true
		}
	}

	return false
})()
