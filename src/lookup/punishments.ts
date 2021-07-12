import { getLookupContainerFromHeaderText } from './shared';
import { debounce } from 'debounce';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const PunishmentKeys = ['Alle', 'Ban', 'Kick', 'Jail', 'JobBan', 'CarBan'] as const;
type PunishmentKey = typeof PunishmentKeys[number];
type PunishmentArrayObject = {
	[key in PunishmentKey]: HTMLElement[];
};

function punishmentsClickEventListener(type: PunishmentKey, period: string, array: PunishmentArrayObject) {
	const modal = document.querySelector<HTMLDivElement>('#modal-punishments-sxplus');
	if (modal === null) return;

	const modalTitle = modal.querySelector<HTMLHeadingElement>('h4');
	if (modalTitle === null) return;

	const modalTable = modal.querySelector<HTMLTableSectionElement>('tbody');
	if (modalTable === null) return;

	modalTitle.textContent = `${type} - ${period}`;

	while (modalTable.lastElementChild) {
		modalTable.removeChild(modalTable.lastElementChild);
	}

	for (const element of array[type]) {
		const clone = element.cloneNode(true) as HTMLElement;

		if (clone.lastElementChild) {
			clone.removeChild(clone.lastElementChild);
		}

		const punishmentNote = clone.querySelector('i');
		if (punishmentNote) {
			punishmentNote.remove();
		}

		modalTable.appendChild(clone);
	}
}

function punishmentsCreate(punishments: HTMLElement[], tbody: HTMLTableSectionElement) {
	//Reset table body
	tbody.innerHTML = `<tr class='row-sxplus' style='font-weight: bold;color:#ed4949;'>
		<th>Altid</th>
	</tr>
	<tr class='row-sxplus'>
		<th>Seneste måned</th>
	</tr>
	<tr class='row-sxplus'>
		<th>Seneste uge</th>
	</tr>
	<tr class='row-sxplus'>
		<th>Seneste døgn</th>
	</tr>`;

	const skip = ['Unban', 'Update'];

	const allPunishments: PunishmentArrayObject = {
		Alle: [],
		Ban: [],
		Kick: [],
		Jail: [],
		JobBan: [],
		CarBan: [],
	};

	const monthPunishments: PunishmentArrayObject = {
		Alle: [],
		Ban: [],
		Kick: [],
		Jail: [],
		JobBan: [],
		CarBan: [],
	};

	const weekPunishments: PunishmentArrayObject = {
		Alle: [],
		Ban: [],
		Kick: [],
		Jail: [],
		JobBan: [],
		CarBan: [],
	};

	const dayPunishments: PunishmentArrayObject = {
		Alle: [],
		Ban: [],
		Kick: [],
		Jail: [],
		JobBan: [],
		CarBan: [],
	};

	for (const element of punishments) {
		if (element.style.getPropertyValue('text-decoration') == 'line-through') continue;

		const time = element.children[0].textContent;
		if (time === null) continue;

		const type = element.children[1].textContent as PunishmentKey | null;
		if (type === null) continue;

		if (skip.includes(type)) continue;
		if (PunishmentKeys.includes(type) === false) continue;

		const now = dayjs();
		const date = dayjs(time, 'DD-MM-YY HH:mm:ss');

		allPunishments.Alle.push(element);
		allPunishments[type].push(element);

		if (date.diff(now, 'day') == 0) {
			dayPunishments.Alle.push(element);
			dayPunishments[type].push(element);

			weekPunishments.Alle.push(element);
			weekPunishments[type].push(element);

			monthPunishments.Alle.push(element);
			monthPunishments[type].push(element);
		} else if (date.diff(now, 'week') == 0) {
			weekPunishments.Alle.push(element);
			weekPunishments[type].push(element);

			monthPunishments.Alle.push(element);
			monthPunishments[type].push(element);
		} else if (date.diff(now, 'month') == 0) {
			monthPunishments.Alle.push(element);
			monthPunishments[type].push(element);
		}
	}

	for (const key in allPunishments) {
		const punishmentKey = key as PunishmentKey;

		if (allPunishments.hasOwnProperty(punishmentKey)) {
			const td = document.createElement('td');

			if (allPunishments[punishmentKey].length > 0) {
				const a = document.createElement('a');
				a.textContent = allPunishments[punishmentKey].length.toString();
				a.style.setProperty('color', 'inherit');
				a.style.setProperty('text-decoration', 'underline');
				a.setAttribute('data-toggle', 'modal');
				a.setAttribute('data-target', '#modal-punishments-sxplus');
				a.addEventListener('click', () => {
					punishmentsClickEventListener(punishmentKey, 'Altid', allPunishments);
				});

				td.appendChild(a);
			} else {
				td.textContent = '0';
			}

			tbody.children[0].appendChild(td);
		}
	}

	for (const key in monthPunishments) {
		const punishmentKey = key as PunishmentKey;

		if (monthPunishments.hasOwnProperty(punishmentKey)) {
			const td = document.createElement('td');

			if (monthPunishments[punishmentKey].length > 0) {
				const a = document.createElement('a');
				a.textContent = monthPunishments[punishmentKey].length.toString();
				a.style.setProperty('color', 'inherit');
				a.style.setProperty('text-decoration', 'underline');
				a.setAttribute('data-toggle', 'modal');
				a.setAttribute('data-target', '#modal-punishments-sxplus');
				a.addEventListener('click', () => {
					punishmentsClickEventListener(punishmentKey, 'Seneste måned', monthPunishments);
				});

				td.appendChild(a);
			} else {
				td.textContent = '0';
			}

			tbody.children[1].appendChild(td);
		}
	}

	for (const key in weekPunishments) {
		const punishmentKey = key as PunishmentKey;

		if (weekPunishments.hasOwnProperty(punishmentKey)) {
			const td = document.createElement('td');

			if (weekPunishments[punishmentKey].length > 0) {
				const a = document.createElement('a');
				a.textContent = weekPunishments[punishmentKey].length.toString();
				a.style.setProperty('color', 'inherit');
				a.style.setProperty('text-decoration', 'underline');
				a.setAttribute('data-toggle', 'modal');
				a.setAttribute('data-target', '#modal-punishments-sxplus');
				a.addEventListener('click', () => {
					punishmentsClickEventListener(punishmentKey, 'Seneste uge', weekPunishments);
				});

				td.appendChild(a);
			} else {
				td.textContent = '0';
			}

			tbody.children[2].appendChild(td);
		}
	}

	for (const key in dayPunishments) {
		const punishmentKey = key as PunishmentKey;

		if (dayPunishments.hasOwnProperty(punishmentKey)) {
			const td = document.createElement('td');

			if (dayPunishments[punishmentKey].length > 0) {
				const a = document.createElement('a');
				a.textContent = dayPunishments[punishmentKey].length.toString();
				a.style.setProperty('color', 'inherit');
				a.style.setProperty('text-decoration', 'underline');
				a.setAttribute('data-toggle', 'modal');
				a.setAttribute('data-target', '#modal-punishments-sxplus');
				a.addEventListener('click', () => {
					punishmentsClickEventListener(punishmentKey, 'Seneste døgn', dayPunishments);
				});

				td.appendChild(a);
			} else {
				td.textContent = '0';
			}

			tbody.children[3].appendChild(td);
		}
	}
}

export const execute = async () => {
	//Some fuckery was happening with the click event listeners when running the function immediately
	setTimeout(() => {
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

		const modal = document.createElement('div');
		modal.className = 'modal fade';
		modal.id = 'modal-punishments-sxplus';
		modal.style.setProperty('display', 'none');
		modal.innerHTML = `<div class='modal-dialog modal-lg' role='document'>
			<div class='modal-content'>
				<div class='modal-header'>
					<button type='button' data-dismiss='modal' aria-label='Close' class='close'><span aria-hidden='true'>×</span></button>
					<h4 class='modal-title' style='color:white;'></h4>
				</div>
				<div class='modal-body' style='color:white;font-size:15px;'>
					<table class='table table_sortable {sortlist: [[0,0]]}' cellspacing='0' width='100%'>
						<thead>
							<tr>
								<th>Tidspunkt</th>
								<th>Type</th>
								<th>Reason</th>
								<th>AdminID</th>
								<th>Unban</th>
							</tr>
						</thead>

						<tbody>

						</tbody>
					</table>
				</div>
				<div class='modal-footer'>
					<button type='button' data-dismiss='modal' class='btn btn-default'>Luk</button>
				</div>
			</div>
		</div>`;

		cont.appendChild(modal);

		const container = document.createElement('div');
		container.className = 'row';
		container.innerHTML = `<div class='col-md-12 col-xs-11'>
			<div class='panel panel-danger'>
				<div class='panel-heading' style='background-color:#16a085;border-bottom-color:white;'>
					<h3 class='panel-title'>Strafoverblik</h3>
				</div>

				<div class='panel-body'>
					<input class='form-control' type='text' placeholder='Filter..'>
					<div class='template__table_static template__table_responsive'>
						<div class='scrollable'>
							<table class='table table_sortable {sortlist: [[0,0]]}' cellspacing='0' width='100%'>
								<thead>
									<tr>
										<th></th>
										<th>Alle</th>
										<th>Ban</th>
										<th>Kick</th>
										<th>Jail</th>
										<th>JobBan</th>
										<th>CarBan</th>
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

		const filter = container.querySelector<HTMLInputElement>('input');
		if (filter === null) return;

		const tbody = container.querySelector<HTMLTableSectionElement>('tbody');
		if (tbody === null) return;

		cont.appendChild(container);
		punishmentsRow.before(container);

		filter.addEventListener(
			'keyup',
			debounce(() => {
				const filterText = filter.value.toLowerCase();

				const filteredPunishments = [];
				for (const punishment of punishments) {
					for (const cell of punishment.children) {
						const cellTextContent = cell.textContent?.toLowerCase();

						if (cellTextContent && cellTextContent.includes(filterText)) {
							filteredPunishments.push(punishment);

							break;
						}
					}
				}

				punishmentsCreate(filteredPunishments, tbody);
			}, 800)
		);

		punishmentsCreate(punishments, tbody);
	});
};

execute();
