import { getLookupContainerFromHeaderText } from './shared';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

type PunishmentArrayObject = HTMLElement[];

const skip = ['Unban', 'Update'];

function punishmentsCreate(punishments: HTMLElement[], tbody: HTMLTableSectionElement) {
	//Reset table body
	tbody.innerHTML = ``;

	const allPunishments: PunishmentArrayObject = [];
	const yearPunishments: PunishmentArrayObject = [];
	const monthPunishments: PunishmentArrayObject = [];
	const weekPunishments: PunishmentArrayObject = [];
	const dayPunishments: PunishmentArrayObject = [];

	let firstPunishment: Dayjs | undefined;

	const now = dayjs();
	for (const element of punishments) {
		if (element.style.getPropertyValue('text-decoration') == 'line-through') continue;

		const time = element.children[0].textContent;
		if (time === null) continue;

		const type = element.children[1].textContent;
		if (type === null) continue;

		if (skip.includes(type)) continue;

		const date = dayjs(time, 'DD-MM-YY HH:mm:ss');

		if (firstPunishment === undefined) {
			firstPunishment = date;
		}

		allPunishments.push(element);

		if (date.diff(now, 'day') == 0) {
			[dayPunishments, weekPunishments, monthPunishments, yearPunishments].forEach((object) => {
				object.push(element);
			});
		} else if (date.diff(now, 'week') == 0) {
			[weekPunishments, monthPunishments, yearPunishments].forEach((object) => {
				object.push(element);
			});
		} else if (date.diff(now, 'month') == 0) {
			[monthPunishments, yearPunishments].forEach((object) => {
				object.push(element);
			});
		} else if (date.diff(now, 'year') == 0) {
			[yearPunishments].forEach((object) => {
				object.push(element);
			});
		}
	}

	if (firstPunishment) {
		const row = document.createElement('tr');
		row.classList.add('row-sxplus');
		row.style.setProperty('font-weight', 'bold');
		row.style.setProperty('color', '#ed4949');
		row.innerHTML = `<th>
			${(() => {
				const intervalPerPunishment = (() => {
					const intervals = [
						['month', 'måned', 'måneder'],
						['week', 'uge', 'uger'],
						['day', 'dag', 'dage'],
						['hour', 'time', 'timer'],
						['minute', 'minut', 'minutter'],
					] as const;

					for (const [interval, single, plural] of intervals) {
						const diff = now.diff(firstPunishment, interval, true);
						const ratio = Math.floor(diff / allPunishments.length);
						if (ratio > 1) return `${ratio} ${plural} mellem hver straf`;
					}

					return 'beh';
				})();

				return `<span class="dashed" title="${intervalPerPunishment}">
					Síden første straf
				</span>`;
			})()}
		</th>
		<td>
			${now.subtract(1, 'hour').isAfter(firstPunishment) ? (allPunishments.length / now.diff(firstPunishment, 'hour', true)).toFixed(2) : '-'}
		</td>
		<td>
			${now.subtract(1, 'day').isAfter(firstPunishment) ? (allPunishments.length / now.diff(firstPunishment, 'day', true)).toFixed(2) : '-'}
		</td>
		<td>
			${now.subtract(1, 'week').isAfter(firstPunishment) ? (allPunishments.length / now.diff(firstPunishment, 'week', true)).toFixed(2) : '-'}
		</td>
		<td>
			${now.subtract(1, 'month').isAfter(firstPunishment) ? (allPunishments.length / now.diff(firstPunishment, 'month', true)).toFixed(2) : '-'}
		</td>`;

		tbody.appendChild(row);
	}

	if (yearPunishments.length > 0 && now.subtract(1, 'year').isAfter(firstPunishment)) {
		const intervalStart = now.subtract(1, 'year');

		const row = document.createElement('tr');
		row.classList.add('row-sxplus');
		row.innerHTML = `<th>
			${(() => {
				const intervalPerPunishment = (() => {
					const intervals = [
						['month', 'måned', 'måneder'],
						['week', 'uge', 'uger'],
						['day', 'dag', 'dage'],
						['hour', 'time', 'timer'],
						['minute', 'minut', 'minutter'],
					] as const;

					for (const [interval, single, plural] of intervals) {
						const diff = now.diff(intervalStart, interval, true);
						const ratio = Math.floor(diff / yearPunishments.length);
						if (ratio > 1) return `${ratio} ${plural} mellem hver straf`;
					}

					return 'beh';
				})();

				return `<span class="dashed" title="${intervalPerPunishment}">
					Seneste år
				</span>`;
			})()}
		</th>
		<td>
			${(() => {
				const interval = 'hour';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (yearPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>
			${(() => {
				const interval = 'day';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (yearPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>
			${(() => {
				const interval = 'week';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (yearPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>
			${(() => {
				const interval = 'month';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (yearPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>`;

		tbody.appendChild(row);
	}

	if (monthPunishments.length > 0 && now.subtract(1, 'month').isAfter(firstPunishment)) {
		const intervalStart = now.subtract(1, 'month');

		const row = document.createElement('tr');
		row.classList.add('row-sxplus');
		row.innerHTML = `<th>
			${(() => {
				const intervalPerPunishment = (() => {
					const intervals = [
						['week', 'uge', 'uger'],
						['day', 'dag', 'dage'],
						['hour', 'time', 'timer'],
						['minute', 'minut', 'minutter'],
					] as const;

					for (const [interval, single, plural] of intervals) {
						const diff = now.diff(intervalStart, interval, true);
						const ratio = Math.floor(diff / monthPunishments.length);
						if (ratio > 1) return `${ratio} ${plural} mellem hver straf`;
					}

					return 'beh';
				})();

				return `<span class="dashed" title="${intervalPerPunishment}">
					Seneste måned
				</span>`;
			})()}
		</th>
		<td>
			${(() => {
				const interval = 'hour';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (monthPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>
			${(() => {
				const interval = 'day';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (monthPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>
			${(() => {
				const interval = 'week';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (monthPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>-</td>`;

		tbody.appendChild(row);
	}

	if (weekPunishments.length > 0 && now.subtract(1, 'week').isAfter(firstPunishment)) {
		const intervalStart = now.subtract(1, 'week');

		const row = document.createElement('tr');
		row.classList.add('row-sxplus');
		row.innerHTML = `<th>
			${(() => {
				const intervalPerPunishment = (() => {
					const intervals = [
						['day', 'dag', 'dage'],
						['hour', 'time', 'timer'],
						['minute', 'minut', 'minutter'],
					] as const;

					for (const [interval, single, plural] of intervals) {
						const diff = now.diff(intervalStart, interval, true);
						const ratio = Math.floor(diff / weekPunishments.length);
						if (ratio > 1) return `${ratio} ${plural} mellem hver straf`;
					}

					return 'beh';
				})();

				return `<span class="dashed" title="${intervalPerPunishment}">
					Seneste uge
				</span>`;
			})()}
		</th>
		<td>
			${(() => {
				const interval = 'hour';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (weekPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>
			${(() => {
				const interval = 'day';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (weekPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>-</td>
		<td class="dashed projected" title="Fremskrivning af mængden af straffe som spilleren vil modtages i det givene interval, hvis hyppigheden på modtagelse af straffe forbliver uædnret.">
			${(() => {
				const interval = 'month';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (weekPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>`;

		tbody.appendChild(row);
	}

	if (dayPunishments.length > 0 && now.subtract(1, 'day').isAfter(firstPunishment)) {
		const intervalStart = now.subtract(1, 'day');

		const row = document.createElement('tr');
		row.classList.add('row-sxplus');
		row.innerHTML = `<th>
			${(() => {
				const intervalPerPunishment = (() => {
					const intervals = [
						['hour', 'time', 'timer'],
						['minute', 'minut', 'minutter'],
					] as const;

					for (const [interval, single, plural] of intervals) {
						const diff = now.diff(intervalStart, interval, true);
						const ratio = Math.floor(diff / dayPunishments.length);
						if (ratio > 1) return `${ratio} ${plural} mellem hver straf`;
					}

					return 'beh';
				})();

				return `<span class="dashed" title="${intervalPerPunishment}">
					Seneste døgn
				</span>`;
			})()}
		</th>
		<td>
			${(() => {
				const interval = 'hour';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (dayPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td>-</td>
		<td class="dashed projected" title="Fremskrivning af mængden af straffe som spilleren vil modtages i det givene interval, hvis hyppigheden på modtagelse af straffe forbliver uædnret.">
			${(() => {
				const interval = 'week';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (dayPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>
		<td class="dashed projected" title="Fremskrivning af mængden af straffe som spilleren vil modtages i det givene interval, hvis hyppigheden på modtagelse af straffe forbliver uædnret.">
			${(() => {
				const interval = 'month';
				const intervalDiff = now.diff(intervalStart, interval, true);

				return (dayPunishments.length / intervalDiff).toFixed(2);
			})()}
		</td>`;

		tbody.appendChild(row);
	}
}

export const execute = async () => {
	//Some fuckery was happening with the click event listeners when running the function immediately
	setTimeout(() => {
		const perfStart = performance.now();

		const cont = document.querySelector<HTMLDivElement>('.template.template__controls');
		if (cont === null) return;

		const [punishments, punishmentsRow]: [HTMLTableRowElement[], HTMLDivElement] | [null, null] = getLookupContainerFromHeaderText(
			'Strafhistorik',
			(element) => {
				const container = element.closest('.row');
				if (container === null) return;

				const children = container.querySelectorAll<HTMLTableRowElement>('tbody > *');

				const punishments = Array.from(children);
				return [punishments, container];
			},
			[null, null]
		);

		if (punishments === null || punishmentsRow === null) return;

		const container = document.createElement('div');
		container.className = 'row';
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
		</div>`;

		const tbody = container.querySelector<HTMLTableSectionElement>('tbody');
		if (tbody === null) return;

		cont.appendChild(container);
		punishmentsRow.before(container);

		punishmentsCreate(punishments, tbody);

		const perfEnd = performance.now();
		console.log(`punishmentFrequency took ${perfEnd - perfStart} milliseconds.`);
	});
};

execute();
