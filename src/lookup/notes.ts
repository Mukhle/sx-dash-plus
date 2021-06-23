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

const [notes, notesRow]: [HTMLElement[], HTMLElement] = getLookupContainerFromHeaderText(
	"Noter",
	(elt) => {
		const notesRow = elt.closest(".row");
		const notes = notesRow?.querySelector<HTMLElement>("div.sp-widget__list")?.children;

		if (!notes) {
			return;
		}

		return [notes, notesRow];
	},
	[null, null]
);

function notesClickEventListener(
	period: string,
	titleElement: HTMLHeadingElement,
	listElement: HTMLElement,
	array: HTMLElement[]
) {
	titleElement.textContent = `Noter - ${period}`;

	while (listElement.lastElementChild) {
		listElement.removeChild(listElement.lastElementChild);
	}

	for (let elt of array) {
		listElement.appendChild(elt.cloneNode(true));
	}
}

function notesCreate(
	modal: HTMLDivElement,
	filter: HTMLInputElement,
	tbody: HTMLTableSectionElement
) {
	tbody.innerHTML = `
	<tr class='sxplusrow'>
		<td>Antal</td>
	</tr>`;

	const modalTitle = modal.querySelector<HTMLHeadingElement>("h4");
	if (!modalTitle) {
		return;
	}

	const modalList = modal.querySelector<HTMLDivElement>("div.sp-widget__list");
	if (!modalList) {
		return;
	}

	const allNotes: HTMLElement[] = [];
	const monthNotes: HTMLElement[] = [];
	const weekNotes: HTMLElement[] = [];
	const dayNotes: HTMLElement[] = [];

	for (let elt of notes) {
		const user = elt.querySelector<HTMLSpanElement>("div.sp-widget__user > span");
		const text = elt.querySelector<HTMLDivElement>("div.sp-widget__text");

		if (user && text) {
			if (text.textContent?.toLowerCase().indexOf(filter.value.toLowerCase()) == -1) {
				continue;
			}

			let time = user.textContent?.match(/\d{2}-\d{2}-\d{2} \d{2}:\d{2}/);

			if (time) {
				const now = dayjs();
				const date = dayjs(time[0]);

				allNotes.push(elt);

				if (date.diff(now, "month") == 0) {
					monthNotes.push(elt);
				}

				if (date.diff(now, "week") == 0) {
					weekNotes.push(elt);
				}

				if (date.diff(now, "day") == 0) {
					dayNotes.push(elt);
				}
			}
		}
	}

	if (allNotes.length > 0) {
		let td = document.createElement("td");

		let a = document.createElement("a");
		a.setAttribute("data-toggle", "modal");
		a.setAttribute("data-target", "#notesModal");
		a.style.setProperty("color", "inherit");
		a.style.setProperty("textDecoration", "underline");
		a.textContent = allNotes.length.toString();
		a.addEventListener("click", () => {
			notesClickEventListener("Altid", modalTitle, modalList, allNotes);
		});

		td.appendChild(a);
		tbody.children[0].appendChild(td);
	} else {
		let td = document.createElement("td");
		td.textContent = "0";
		tbody.children[0].appendChild(td);
	}

	if (monthNotes.length > 0) {
		let td = document.createElement("td");

		let a = document.createElement("a");
		a.setAttribute("data-toggle", "modal");
		a.setAttribute("data-target", "#notesModal");
		a.style.setProperty("color", "inherit");
		a.style.setProperty("textDecoration", "underline");
		a.textContent = monthNotes.length.toString();
		a.addEventListener("click", () => {
			notesClickEventListener("Seneste måned", modalTitle, modalList, monthNotes);
		});

		td.appendChild(a);
		tbody.children[0].appendChild(td);
	} else {
		let td = document.createElement("td");
		td.textContent = "0";
		tbody.children[0].appendChild(td);
	}

	if (weekNotes.length > 0) {
		let td = document.createElement("td");

		let a = document.createElement("a");
		a.setAttribute("data-toggle", "modal");
		a.setAttribute("data-target", "#notesModal");
		a.style.setProperty("color", "inherit");
		a.style.setProperty("textDecoration", "underline");
		a.textContent = weekNotes.length.toString();
		a.addEventListener("click", () => {
			notesClickEventListener("Seneste uge", modalTitle, modalList, weekNotes);
		});

		td.appendChild(a);
		tbody.children[0].appendChild(td);
	} else {
		let td = document.createElement("td");
		td.textContent = "0";
		tbody.children[0].appendChild(td);
	}

	if (dayNotes.length > 0) {
		let td = document.createElement("td");

		let a = document.createElement("a");
		a.setAttribute("data-toggle", "modal");
		a.setAttribute("data-target", "#notesModal");
		a.style.setProperty("color", "inherit");
		a.style.setProperty("textDecoration", "underline");
		a.textContent = dayNotes.length.toString();
		a.addEventListener("click", () => {
			notesClickEventListener("Seneste døgn", modalTitle, modalList, dayNotes);
		});

		td.appendChild(a);
		tbody.children[0].appendChild(td);
	} else {
		let td = document.createElement("td");
		td.textContent = "0";
		tbody.children[0].appendChild(td);
	}
}

if (notes) {
	let modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = "notesModal";
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
				<div class='sp-widget'>
					<div class='scrollable'>
						<div class='sp-widget__cont'>
							<div class='sp-widget__list'>

							</div>
						</div>
					</div>
				</div>
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
			<div class='panel-heading' style='background-color:#2980b9;border-bottom-color:white;'>
				<h3 class='panel-title'>Noteoverblik</h3>
			</div>

			<div class='panel-body'>
				<input class='form-control' type='text' placeholder='Filter..'>
				<div class='template__table_static template__table_responsive'>
					<div class='scrollable'>
						<table class='table table_sortable {sortlist: [[0,0]]}' cellspacing='0' width='100%'>
							<thead>
								<tr>
									<th>Noter</th>
									<th>Altid</th>
									<th>Seneste måned</th>
									<th>Seneste uge</th>
									<th>Seneste døgn</th>
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
	notesRow.before(container);

	filter.addEventListener("keyup", () => {
		notesCreate(modal, filter, tbody);
	});

	notesCreate(modal, filter, tbody);
}
