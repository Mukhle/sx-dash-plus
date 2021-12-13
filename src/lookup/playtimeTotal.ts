import { userIsStaff, getLookupContainerFromHeaderText } from './shared'

function proccessPlaytimeTotals(root: HTMLElement) {
	const tspans = root.querySelectorAll('tspan')
	if (tspans === null) return

	const largest = tspans[4]
	if (largest === null) return

	const largestAsString = largest.textContent
	if (largestAsString === null) return

	const largestAsNumber = Number.parseInt(largestAsString.replaceAll(',', ''))
	if (largestAsNumber === null) return

	const bars = root.querySelectorAll('svg > rect')
	if (bars === null) return

	const dataPoints: [string, number][] = []
	for (const bar of bars) {
		const element = bar.getBoundingClientRect()

		const timeLength = Math.round(element.height / 284 * largestAsNumber)

		const fill = bar.getAttribute('fill')
		if (fill === null) continue

		switch (fill) {
			case '#ddd78d':
				dataPoints.push(['Online', timeLength])

				break
			case '#2980b9':
				dataPoints.push(['Aktiv', timeLength])

				break
			case '#34495e':
				dataPoints.push(['Inaktiv', timeLength])

				break
			case '#9fadbd':
				dataPoints.push(['Politi', timeLength])

				break
		}
	}

	const cont = document.querySelector<HTMLDivElement>('.template.template__controls')
	if (cont === null) return

	const row = getLookupContainerFromHeaderText<HTMLDivElement, null>(
		'Spilletidshistorik',
		(element) => {
			const container = element.closest<HTMLDivElement>('.row')
			if (container === null) return

			return container
		},
		null,
	)
	if (row === null) return

	const container = document.createElement('div')
	container.className = 'row'
	container.innerHTML = `<div class="col-md-12 col-xs-11">
		<div class="panel panel-danger">
			<div class="panel-heading" style="background-color:#2980b9;border-bottom-color:white;">
				<h3 class="panel-title">Spilletidsoverblik</h3>
			</div>

			<div class="panel-body">
				<p></p>
			</div>
		</div>
	</div>`

	const paragraph = container.querySelector<HTMLParagraphElement>('.panel-body > p')
	if (paragraph === null) return

	cont.appendChild(container)
	row.after(container)

	const texts = []
	const totals = dataPoints.reduce<{[key: string]: number}>((current, element) => {
		const [identifier, span] = element

		const storedValue = current[identifier]
		if (storedValue) {
			current[identifier] = storedValue + span
		} else {
			current[identifier] = span
		}

		return current
	}, {})

	for (const [identifier, span] of Object.entries(totals)) {
		texts.push(`${identifier}: ${span}`)
	}

	paragraph.innerText = texts.join(' | ')
}

export async function execute(): Promise<void> {
	if (userIsStaff) {
		const perfStart = performance.now()

		const container = document.querySelector('div.template.template__controls')

		if (container) {
			const observer = new MutationObserver((mutationsList, observer) => {
				for (const mutation of mutationsList) {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach((node) => {
							if (node instanceof HTMLElement) {
								if (node.getAttribute('data-ajaxlookup-table') === 'playtime') {
									proccessPlaytimeTotals(node)

									observer.disconnect()
								}
							}
						})
					}
				}
			})

			observer.observe(container, {
				'childList': true,
			})
		}

		const perfEnd = performance.now()
		console.log(`playtimeTotal took ${perfEnd - perfStart} milliseconds.`)
	}
}

execute()