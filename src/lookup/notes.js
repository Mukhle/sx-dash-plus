const [notes, notesRow] = getLookupContainerFromHeaderText("Noter", (elt) => {
	const notesRow = elt.closest(".row");
	const notes = notesRow.querySelector("div.sp-widget__list").children;

	return [notes, notesRow];
}) ?? [null, null];

function notesClickEventListener(period, titleElement, listElement, array) {
	titleElement.textContent = `Noter - ${period}`;

	while (listElement.lastElementChild) {
		listElement.removeChild(listElement.lastElementChild);
	}

	for (let elt of array) {
		listElement.appendChild(elt.cloneNode(true));
	}
}

function notesCreate(modal, filter, tbody) {
	tbody.innerHTML = `
	<tr class="sxplusrow">
		<td>Antal</td>
	</tr>`;

	let modalTitle = modal.querySelector("h4");
	let modalList = modal.querySelector("div.sp-widget__list");

	let allNotes = [];
	let monthNotes = [];
	let weekNotes = [];
	let dayNotes = [];

	for (let elt of notes) {
		let user = elt.querySelector("div.sp-widget__user > span");
		let text = elt.querySelector("div.sp-widget__text");

		if (user && text) {
			if (
				text.textContent.toLowerCase().indexOf(filter.value.toLowerCase()) == -1
			) {
				continue;
			}

			let time = user.textContent.match(/\d{2}-\d{2}-\d{2} \d{2}:\d{2}/);

			if (time) {
				let date = new Date(
					time[0].replace(/(\d{2})-(\d{2})-(\d{2})/, "$2/$1/$3")
				);

				allNotes.push(elt);

				if (date > monthRange) {
					monthNotes.push(elt);
				}

				if (date > weekRange) {
					weekNotes.push(elt);
				}

				if (date > dayRange) {
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
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";
		a.textContent = allNotes.length;
		a.addEventListener(
			"click",
			notesClickEventListener.bind(
				null,
				"Altid",
				modalTitle,
				modalList,
				allNotes
			)
		);

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
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";
		a.textContent = monthNotes.length;
		a.addEventListener(
			"click",
			notesClickEventListener.bind(
				null,
				"Seneste måned",
				modalTitle,
				modalList,
				monthNotes
			)
		);

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
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";
		a.textContent = weekNotes.length;
		a.addEventListener(
			"click",
			notesClickEventListener.bind(
				null,
				"Seneste uge",
				modalTitle,
				modalList,
				weekNotes
			)
		);

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
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";
		a.textContent = dayNotes.length;
		a.addEventListener(
			"click",
			notesClickEventListener.bind(
				null,
				"Seneste døgn",
				modalTitle,
				modalList,
				dayNotes
			)
		);

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
	modal.style = "display: none;";
	modal.innerHTML = `<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>
				<h4 class="modal-title" style="color:white;"></h4>
			</div>
			<div class="modal-body" style="color:white;font-size:15px;">
				<div class="sp-widget">
					<div class="scrollable">
						<div class="sp-widget__cont">
							<div class="sp-widget__list">

							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" data-dismiss="modal" class="btn btn-default">Luk</button>
			</div>
		</div>
	</div>`;

	cont.appendChild(modal);

	let container = document.createElement("div");
	container.className = "row";
	container.innerHTML = `<div class="col-md-12 col-xs-11">
		<div class="panel panel-danger">
			<div class="panel-heading" style="background-color:#2980b9;border-bottom-color:white;">
				<h3 class="panel-title">Noteoverblik</h3>
			</div>

			<div class="panel-body">
				<input class="form-control" type="text" placeholder="Filter..">
				<div class="template__table_static template__table_responsive">
					<div class="scrollable">
						<table class="table table_sortable {sortlist: [[0,0]]}" cellspacing="0" width="100%">
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

	let filter = container.querySelector("input");
	let tbody = container.querySelector("tbody");

	cont.appendChild(container);
	notesRow.before(container);

	filter.addEventListener(
		"keyup",
		notesCreate.bind(null, modal, filter, tbody)
	);

	notesCreate(modal, filter, tbody);
}
