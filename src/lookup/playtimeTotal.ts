import { userIsStaff, getLookupContainerFromHeaderText } from './shared'
import throttle from 'lodash/throttle'

function setupTotalsContainer() {
	console.log('create thing')
	const cont = document.querySelector<HTMLDivElement>('.template.template__controls')
	console.log('cont', cont)
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
	console.log('row', row)
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

	console.log('container', container)

	const paragraph = container.querySelector<HTMLParagraphElement>('.panel-body > p')
	console.log('paragraph', paragraph)
	if (paragraph === null) return

	cont.appendChild(container)
	row.after(container)

	const texts = []
	for (const [label, value] of Object.entries(dataPoints.totals)) {
		texts.push(`${label}: ${value}`)
	}

	paragraph.innerText = texts.join(' | ')
}

interface IAccumulatedData {
	totalPoints: number
	processed: {
		[key: string]: boolean
	}
	totals: {
		[key: string]: number
	}
}

const dataPoints: IAccumulatedData = {
	'totalPoints': 0,
	'processed': {},
	'totals': {},
}

const recordData = throttle((element: HTMLElement): true | undefined => {
	const label = element.querySelector('.morris-hover-row-label')
	if (label === null) return

	const labelValue = label.textContent
	if (labelValue === null) return

	if (dataPoints.processed[labelValue] !== undefined) return

	const hoverPoints = element.querySelectorAll('.morris-hover-point')
	if (hoverPoints === null) return

	hoverPoints.forEach((hoverPoint) => {
		const dataPointText = hoverPoint.textContent
		if (dataPointText === null) return

		const labelMatch = dataPointText.match(/\w+/)
		if (labelMatch === null) return
		const [dataPointLabel] = labelMatch

		const valueMatch = dataPointText.match(/\d+/)
		if (valueMatch === null) return
		const [dataPointValue] = valueMatch

		const dataPointNumber = Number.parseInt(dataPointValue)

		const storedTotal = dataPoints.totals[dataPointLabel]
		if (storedTotal === undefined) {
			dataPoints.totals[dataPointLabel] = dataPointNumber
		} else {
			dataPoints.totals[dataPointLabel] = storedTotal + dataPointNumber
		}
	})

	dataPoints.processed[labelValue] = true

	if (dataPoints.totalPoints === Object.values(dataPoints.processed).length) {
		console.log(dataPoints)
		return true
	}
}, 150)

function setupPlaytimeMutationObserver(root: HTMLElement) {
	const hover = root.querySelector('.morris-hover')
	if (hover === null) return

	const bars = root.querySelectorAll('svg > rect')
	if (bars === null) return

	dataPoints.totalPoints = bars.length / 2

	const observer = new MutationObserver((mutationsList, observer) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				if (mutation.target instanceof HTMLElement) {
					if (recordData(mutation.target)) {
						setupTotalsContainer()
						observer.disconnect()
					}
				}
			}
		}
	})

	observer.observe(hover, {
		'subtree': true,
		'childList': true,
	})
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
									setupPlaytimeMutationObserver(node)

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