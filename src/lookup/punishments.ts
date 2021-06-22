import { getLookupContainerFromHeaderText } from "./shared";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const cont = document.querySelector(
	"body > div > div > div.main > div > div.container-fluid.half-padding > div"
);

if (!cont) {
	throw new Error("Content div not found");
}

const [punishments, punishmentsRow]: [HTMLElement[], HTMLElement] =
	getLookupContainerFromHeaderText(
		"Strafhistorik",
		(elt) => {
			const punishmentsRow = elt.closest(".row");
			const punishments = punishmentsRow?.querySelector("tbody")?.children;

			return [punishments, punishmentsRow];
		},
		[null, null]
	);

const PunishmentKeys = ["Alle", "Ban", "Kick", "Jail", "JobBan", "CarBan"] as const;
type PunishmentKey = typeof PunishmentKeys[number];
type PunishmentArrayObject = {
	[key in PunishmentKey]: HTMLElement[];
};

function punishmentsClickEventListener(
	type: PunishmentKey,
	period: string,
	titleElement: HTMLHeadingElement,
	tableElement: HTMLTableSectionElement,
	array: PunishmentArrayObject
) {
	titleElement.textContent = `${type} - ${period}`;

	while (tableElement.lastElementChild) {
		tableElement.removeChild(tableElement.lastElementChild);
	}

	for (let elt of array[type]) {
		let clone = elt.cloneNode(true) as HTMLElement;

		if (clone.lastElementChild) {
			clone.removeChild(clone.lastElementChild);
		}

		tableElement.appendChild(clone);
	}
}

function punishmentsCreate(
	modal: HTMLDivElement,
	filter: HTMLInputElement,
	tbody: HTMLTableSectionElement
) {
	tbody.innerHTML = `
	<tr class='sxplusrow' style='font-weight: bold;color:#ed4949;'>
		<td>Altid</td>
	</tr>
	<tr class='sxplusrow'>
		<td>Seneste måned</td>
	</tr>
	<tr class='sxplusrow'>
		<td>Seneste uge</td>
	</tr>
	<tr class='sxplusrow'>
		<td>Seneste døgn</td>
	</tr>`;

	const modalTitle = modal.querySelector("h4");
	if (modalTitle == null) {
		return;
	}

	const modalTable = modal.querySelector("tbody");
	if (modalTable == null) {
		return;
	}

	const skip = ["Unban", "Update"];

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

	for (let elt of punishments) {
		if (elt.style.getPropertyValue("textDecoration") == "line-through") {
			continue;
		}

		const time = elt.children[0].textContent;

		if (time == null) {
			continue;
		}

		const type = elt.children[1].textContent as PunishmentKey | null;

		if (type == null) {
			continue;
		}

		if (skip.includes(type)) {
			continue;
		}

		if (!(type in PunishmentKeys)) {
			continue;
		}

		let filterSkip = true;

		const filterText = filter.value.toLowerCase();
		for (let elt2 of elt.children) {
			const eltText = elt2.textContent?.toLowerCase();

			if (eltText && eltText.indexOf(filterText) > -1) {
				filterSkip = false;

				break;
			}
		}

		if (filterSkip) {
			continue;
		}

		const now = dayjs();
		const date = dayjs(time[0]);

		allPunishments.Alle.push(elt);
		allPunishments[type].push(elt);

		if (date.diff(now, "month") == 0) {
			monthPunishments.Alle.push(elt);
			monthPunishments[type].push(elt);
		}

		if (date.diff(now, "week") == 0) {
			weekPunishments.Alle.push(elt);
			weekPunishments[type].push(elt);
		}

		if (date.diff(now, "day") == 0) {
			dayPunishments.Alle.push(elt);
			dayPunishments[type].push(elt);
		}
	}

	for (const key in allPunishments) {
		const punishmentKey = key as PunishmentKey;

		if (allPunishments.hasOwnProperty(punishmentKey)) {
			if (allPunishments[punishmentKey].length > 0) {
				let td = document.createElement("td");

				let a = document.createElement("a");
				a.setAttribute("data-toggle", "modal");
				a.setAttribute("data-target", "#punishmentsModal");
				a.style.setProperty("color", "inherit");
				a.style.setProperty("textDecoration", "underline");
				a.textContent = allPunishments[punishmentKey].length.toString();
				a.addEventListener("click", () => {
					punishmentsClickEventListener(
						punishmentKey,
						"Altid",
						modalTitle,
						modalTable,
						allPunishments
					);
				});

				td.appendChild(a);
				tbody.children[0].appendChild(td);
			} else {
				let td = document.createElement("td");
				td.textContent = "0";
				tbody.children[0].appendChild(td);
			}
		}
	}

	for (let key in monthPunishments) {
		const punishmentKey = key as PunishmentKey;

		if (monthPunishments.hasOwnProperty(punishmentKey)) {
			if (monthPunishments[punishmentKey].length > 0) {
				let td = document.createElement("td");

				let a = document.createElement("a");
				a.setAttribute("data-toggle", "modal");
				a.setAttribute("data-target", "#punishmentsModal");
				a.style.setProperty("color", "inherit");
				a.style.setProperty("textDecoration", "underline");
				a.textContent = monthPunishments[punishmentKey].length.toString();
				a.addEventListener("click", () => {
					punishmentsClickEventListener(
						punishmentKey,
						"Seneste måned",
						modalTitle,
						modalTable,
						monthPunishments
					);
				});

				td.appendChild(a);
				tbody.children[1].appendChild(td);
			} else {
				let td = document.createElement("td");
				td.textContent = "0";
				tbody.children[1].appendChild(td);
			}
		}
	}

	for (let key in weekPunishments) {
		const punishmentKey = key as PunishmentKey;

		if (weekPunishments.hasOwnProperty(punishmentKey)) {
			if (weekPunishments[punishmentKey].length > 0) {
				let td = document.createElement("td");

				let a = document.createElement("a");
				a.setAttribute("data-toggle", "modal");
				a.setAttribute("data-target", "#punishmentsModal");
				a.style.setProperty("color", "inherit");
				a.style.setProperty("textDecoration", "underline");
				a.textContent = weekPunishments[punishmentKey].length.toString();
				a.addEventListener("click", () => {
					punishmentsClickEventListener(
						punishmentKey,
						"Seneste uge",
						modalTitle,
						modalTable,
						weekPunishments
					);
				});

				td.appendChild(a);
				tbody.children[2].appendChild(td);
			} else {
				let td = document.createElement("td");
				td.textContent = "0";
				tbody.children[2].appendChild(td);
			}
		}
	}

	for (let key in dayPunishments) {
		const punishmentKey = key as PunishmentKey;

		if (dayPunishments.hasOwnProperty(punishmentKey)) {
			if (dayPunishments[punishmentKey].length > 0) {
				let td = document.createElement("td");

				let a = document.createElement("a");
				a.setAttribute("data-toggle", "modal");
				a.setAttribute("data-target", "#punishmentsModal");
				a.style.setProperty("color", "inherit");
				a.style.setProperty("textDecoration", "underline");
				a.textContent = dayPunishments[punishmentKey].length.toString();
				a.addEventListener("click", () => {
					punishmentsClickEventListener(
						punishmentKey,
						"Seneste døgn",
						modalTitle,
						modalTable,
						dayPunishments
					);
				});

				td.appendChild(a);
				tbody.children[3].appendChild(td);
			} else {
				let td = document.createElement("td");
				td.textContent = "0";
				tbody.children[3].appendChild(td);
			}
		}
	}
}

if (punishments) {
	let modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = "punishmentsModal";
	//Clear all CSS properties on the element
	for (let i = 1; modal.style.length; i++) {
		const propertyName = modal.style.item(i);
		modal.style.removeProperty(propertyName);
	}
	modal.style.setProperty("display", "none");
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

	let container = document.createElement("div");
	container.className = "row";
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
									<th>Tidsperiode</th>
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

	const filter = container.querySelector<HTMLInputElement>("input");
	if (!filter) {
		throw new Error("Filter text entry not found");
	}

	const tbody = container.querySelector<HTMLTableSectionElement>("tbody");
	if (!tbody) {
		throw new Error("Table body not found");
	}

	cont.appendChild(container);
	punishmentsRow.before(container);

	filter.addEventListener("keyup", () => {
		punishmentsCreate(modal, filter, tbody);
	});

	punishmentsCreate(modal, filter, tbody);
}
