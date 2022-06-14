import { getLookupContainerFromHeaderText } from './shared'
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
dayjs.extend(customParseFormat)
dayjs.extend(duration)

type Intervals = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';

const durationData = [
	['years', 'år', 'år'],
	['months', 'måned', 'måneder'],
	['weeks', 'uge', 'uger'],
	['days', 'dag', 'dage'],
	['hours', 'time', 'timer'],
	['minutes', 'minut', 'minutter'],
] as const
function createTableHead(amount: number, now: Dayjs, start: Dayjs, intervalText: string) {
	let duration = dayjs.duration(now.diff(start) / amount)

	const times = []
	for (const [interval, intervalSingle, intervalPlural] of durationData) {
		const amountOfUnit = duration[interval]()

		if (amountOfUnit) {
			if (amountOfUnit === 1) {
				times.push(`${amountOfUnit} ${intervalSingle}`)
			} else {
				times.push(`${amountOfUnit} ${intervalPlural}`)
			}

			duration = duration.subtract(amountOfUnit, interval)
		}
	}

	return `<span class="dashed" title="Gennemsnitligt ${times.join(', ')} mellem hver straf">
		${intervalText}
	</span>`
}

function createAllTimeTableData(amount: number, now: Dayjs, start: Dayjs, interval: Intervals) {
	if (now.subtract(1, interval).isAfter(start)) {
		return createTableData(amount, now, start, interval)
	}

	return ''
}

function createTableData(amount: number, now: Dayjs, start: Dayjs, interval: Intervals) {
	return (amount / now.diff(start, interval, true)).toFixed(3)
}

const skip = ['Unban', 'Update']

function punishmentsCreate(punishments: HTMLElement[], tbody: HTMLTableSectionElement) {
	//Reset table body
	tbody.innerHTML = ''

	const punishmentAmounts = {
		'all': 0,
		'year': 0,
		'month': 0,
		'week': 0,
		'day': 0,
	}

	let firstPunishment: Dayjs | undefined

	const now = dayjs()
	for (const element of punishments) {
		if (element.style.getPropertyValue('text-decoration') == 'line-through') continue

		const time = element.children[0].textContent
		if (time === null) continue

		const type = element.children[1].textContent
		if (type === null) continue

		if (skip.includes(type)) continue

		const date = dayjs(time, 'DD-MM-YY HH:mm:ss')

		if (firstPunishment === undefined) {
			firstPunishment = date
		}

		punishmentAmounts.all++

		if (date.diff(now, 'day') == 0) {
			(['day', 'week', 'month', 'year'] as const).forEach((key) => {
				punishmentAmounts[key]++
			})
		} else if (date.diff(now, 'week') == 0) {
			(['week', 'month', 'year'] as const).forEach((key) => {
				punishmentAmounts[key]++
			})
		} else if (date.diff(now, 'month') == 0) {
			(['month', 'year'] as const).forEach((key) => {
				punishmentAmounts[key]++
			})
		} else if (date.diff(now, 'year') == 0) {
			(['year'] as const).forEach((key) => {
				punishmentAmounts[key]++
			})
		}
	}

	if (firstPunishment) {
		const row = document.createElement('tr')
		row.classList.add('row-sxplus')
		row.style.setProperty('font-weight', 'bold')
		row.style.setProperty('color', '#ed4949')
		row.innerHTML = `<th>
			${createTableHead(punishmentAmounts.all, now, firstPunishment, 'Siden første straf')}
		</th>
		<td>
			${createAllTimeTableData(punishmentAmounts.all, now, firstPunishment, 'hours')}
		</td>
		<td>
			${createAllTimeTableData(punishmentAmounts.all, now, firstPunishment, 'days')}
		</td>
		<td>
			${createAllTimeTableData(punishmentAmounts.all, now, firstPunishment, 'weeks')}
		</td>
		<td>
			${createAllTimeTableData(punishmentAmounts.all, now, firstPunishment, 'months')}
		</td>`

		tbody.appendChild(row)
	}

	if (punishmentAmounts.year > 0 && now.subtract(1, 'year').isAfter(firstPunishment)) {
		const intervalStart = now.subtract(1, 'year')

		const row = document.createElement('tr')
		row.classList.add('row-sxplus')
		row.innerHTML = `<th>
			${createTableHead(punishmentAmounts.year, now, intervalStart, 'Seneste år')}
		</th>
		<td>
			${createTableData(punishmentAmounts.year, now, intervalStart, 'hours')}
		</td>
		<td>
			${createTableData(punishmentAmounts.year, now, intervalStart, 'days')}
		</td>
		<td>
			${createTableData(punishmentAmounts.year, now, intervalStart, 'weeks')}
		</td>
		<td>
			${createTableData(punishmentAmounts.year, now, intervalStart, 'months')}
		</td>`

		tbody.appendChild(row)
	}

	if (punishmentAmounts.month > 0 && now.subtract(1, 'month').isAfter(firstPunishment)) {
		const intervalStart = now.subtract(1, 'month')

		const row = document.createElement('tr')
		row.classList.add('row-sxplus')
		row.innerHTML = `<th>
			${createTableHead(punishmentAmounts.month, now, intervalStart, 'Seneste måned')}
		</th>
		<td>
			${createTableData(punishmentAmounts.month, now, intervalStart, 'hours')}
		</td>
		<td>
			${createTableData(punishmentAmounts.month, now, intervalStart, 'days')}
		</td>
		<td>
			${createTableData(punishmentAmounts.month, now, intervalStart, 'weeks')}
		</td>
		<td></td>`

		tbody.appendChild(row)
	}

	if (punishmentAmounts.week > 0 && now.subtract(1, 'week').isAfter(firstPunishment)) {
		const intervalStart = now.subtract(1, 'week')

		const row = document.createElement('tr')
		row.classList.add('row-sxplus')
		row.innerHTML = `<th>
			${createTableHead(punishmentAmounts.week, now, intervalStart, 'Seneste uge')}
		</th>
		<td>
			${createTableData(punishmentAmounts.week, now, intervalStart, 'hours')}
		</td>
		<td>
			${createTableData(punishmentAmounts.week, now, intervalStart, 'days')}
		</td>
		<td></td>
		<td></td>`

		tbody.appendChild(row)
	}

	if (punishmentAmounts.day > 0 && now.subtract(1, 'day').isAfter(firstPunishment)) {
		const intervalStart = now.subtract(1, 'day')

		const row = document.createElement('tr')
		row.classList.add('row-sxplus')
		row.innerHTML = `<th>
			${createTableHead(punishmentAmounts.day, now, intervalStart, 'Seneste døgn')}
		</th>
		<td>
			${createTableData(punishmentAmounts.day, now, intervalStart, 'hours')}
		</td>
		<td></td>
		<td></td>
		<td></td>`

		tbody.appendChild(row)
	}
}

export async function execute(): Promise<void> {
	//Some fuckery was happening with the click event listeners when running the function immediately
	setTimeout(() => {
		console.profile('punishmentFrequency')

		const cont = document.querySelector<HTMLDivElement>('.template.template__controls')
		if (cont === null) return

		const [punishments, punishmentsRow] = getLookupContainerFromHeaderText<[HTMLTableRowElement[], HTMLDivElement], [null, null]>(
			'Strafhistorik',
			(element) => {
				const container = element.closest<HTMLDivElement>('.row')
				if (container === null) return

				const children = container.querySelectorAll<HTMLTableRowElement>('tbody > *')

				const punishments = Array.from(children)
				return [punishments, container]
			},
			[null, null],
		)

		if (punishments === null || punishmentsRow === null) return

		const container = document.createElement('div')
		container.className = 'row'
		container.innerHTML = `<div class="col-md-12 col-xs-11">
			<div class="panel panel-danger">
				<div class="panel-heading" style="background-color:#16a085;border-bottom-color:white;">
					<h3 class="panel-title">Strafhyppighed</h3>
				</div>

				<div class="panel-body">	
					<div class="template__table_static template__table_responsive">
						<div class="scrollable">
							<table class="table table_sortable {sortlist: [[0,0]]}" cellspacing="0" width="100%">
								<thead>
									<tr>
										<th></th>
										<th>Timeligt gennemsnit</th>
										<th>Dagligt gennemsnit</th>
										<th>Ugentligt gennemsnit</th>
										<th>Månedligt gennemsnit</th>
									</tr>
								</thead>

								<tbody>
									
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>`

		const tbody = container.querySelector<HTMLTableSectionElement>('tbody')
		if (tbody === null) return

		cont.appendChild(container)
		punishmentsRow.before(container)

		punishmentsCreate(punishments, tbody)

		console.profileEnd('punishmentFrequency')
	})
}

execute()
