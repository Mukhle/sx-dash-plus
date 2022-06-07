export async function execute(): Promise<void> {
	for (const element of document.querySelectorAll<HTMLTableRowElement>('.table > tbody > tr')) {
		const attribute = element.getAttribute('onclick')
		if (!attribute?.includes('lookup')) continue

		element.removeAttribute('onclick')

		const clone = element.cloneNode(true) as HTMLTableRowElement
		clone.classList.add('row-sxplus')

		element.replaceWith(clone)
	}
}

execute()
