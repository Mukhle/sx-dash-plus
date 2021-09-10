import { userIsStaff, processTextNodes } from './shared'

function removeTableRowListeners(root: HTMLElement) {
	for (const element of root.querySelectorAll<HTMLTableRowElement>('.table > tbody > tr')) {
		element.removeAttribute('onclick')

		const clone = element.cloneNode(true) as HTMLTableRowElement
		clone.classList.add('row-sxplus')

		element.replaceWith(clone)
	}
}

export async function execute(): Promise<void> {
	if (userIsStaff) {
		const container = document.querySelector('div.template.template__controls')

		if (container) {
			const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
				for (const mutation of mutationsList) {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach((node) => {
							if (node instanceof HTMLElement) {
								if (node.hasAttribute('data-ajaxlookup-table')) {
									processTextNodes(node)
									removeTableRowListeners(node)
								}
							}
						})
					}
				}
			})

			observer.observe(container, { 'childList': true })
		}
	}
}

execute()
