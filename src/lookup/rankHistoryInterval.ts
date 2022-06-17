import { userIsStaff } from './shared'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const durationData = [
	['years', 'år', 'år'],
	['months', 'måned', 'måneder'],
	['weeks', 'uge', 'uger'],
	['days', 'dag', 'dage'],
	['hours', 'time', 'timer'],
	['minutes', 'minut', 'minutter'],
] as const

function secondsToDurationString(from: Dayjs, to: Dayjs) {
	const duration = from.diff(to)
	let remaining = dayjs.duration(duration)

	const times = []
	for (const [interval, intervalSingle, intervalPlural] of durationData) {
		const amountOfUnit = remaining[interval]()

		if (amountOfUnit) {
			if (amountOfUnit === 1) {
				times.push(`${amountOfUnit} ${intervalSingle}`)
			} else {
				times.push(`${amountOfUnit} ${intervalPlural}`)
			}

			remaining = remaining.subtract(amountOfUnit, interval)
		}
	}

	if (times.length === 0) {
		return 'mindre end et minut'
	}

	return times.join(', ')
}

function proccessRankHistory(root: HTMLElement) {
	const headRow = root.querySelector<HTMLTableElement>('thead > tr')
	if (headRow === null) return

	const bodyRows = root.querySelectorAll<HTMLTableRowElement>('tbody > tr')

	const durationColumn = document.createElement('th')
	durationColumn.innerHTML = 'Tid tilbragt i nye rank'
	headRow.appendChild(durationColumn)

	let previousDate = dayjs()
	for (const row of bodyRows) {
		const [previousRank, newRank, timestamp] = row.querySelectorAll('td')
		if (previousRank === null || newRank === null || timestamp === null) continue

		const previousRankAsString = previousRank.textContent
		if (previousRankAsString === null || previousRankAsString === 'Ingen data') continue

		const durationCell = document.createElement('td')
		row.appendChild(durationCell)

		const newRankAsString = newRank.textContent
		if (newRankAsString === null) continue

		const timestampAsString = timestamp.textContent
		if (timestampAsString === null) continue

		const timestampAsDate = dayjs(timestampAsString, 'DD-MM-YY HH.mm')

		if (newRankAsString !== 'user') {
			durationCell.innerHTML = secondsToDurationString(previousDate, timestampAsDate)
		}

		previousDate = timestampAsDate
	}
}

export async function execute(): Promise<void> {
	if (userIsStaff) {
		console.profile('rankHistoryInterval')

		const container = document.querySelector('div.template.template__controls')

		if (container) {
			const observer = new MutationObserver((mutationsList, observer) => {
				for (const mutation of mutationsList) {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach((node) => {
							if (node instanceof HTMLElement) {
								if (node.getAttribute('data-ajaxlookup-table') === 'rank') {
									proccessRankHistory(node)

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

		console.profileEnd('rankHistoryInterval')
	}
}

execute()