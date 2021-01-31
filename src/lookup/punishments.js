const [punishments, punishmentsRow] = getLookupContainerFromHeaderText(
	"Strafhistorik",
	(elt) => {
		const punishmentsRow = elt.closest(".row");
		const punishments = punishmentsRow.querySelector("tbody").children;

		return [punishments, punishmentsRow];
	}
) ?? [null, null];

function punishmentsClickEventListener(
	type,
	period,
	titleElement,
	tableElement,
	array
) {
	titleElement.textContent = `${type} - ${period}`;

	while (tableElement.lastElementChild) {
		tableElement.removeChild(tableElement.lastElementChild);
	}

	for (let elt of array[type]) {
		let clone = elt.cloneNode(true);
		clone.removeChild(clone.lastElementChild);

		tableElement.appendChild(clone);
	}
}

function punishmentsCreate(modal, filter, tbody) {
	tbody.innerHTML = `
	<tr style="font-weight: bold;color:#ed4949;">
		<td>Altid</td>
	</tr>
	<tr style="">
		<td>Seneste måned</td>
	</tr>
	<tr style="">
		<td>Seneste uge</td>
	</tr>
	<tr style="">
		<td>Seneste døgn</td>
	</tr>`;

	let modalTitle = modal.querySelector("h4");
	let modalTable = modal.querySelector("tbody");

	const skip = ["Unban", "Update"];

	let allPunishments = {
		Alle: [],
		Ban: [],
		Kick: [],
		Jail: [],
		JobBan: [],
		CarBan: [],
	};

	let monthPunishments = {
		Alle: [],
		Ban: [],
		Kick: [],
		Jail: [],
		JobBan: [],
		CarBan: [],
	};

	let weekPunishments = {
		Alle: [],
		Ban: [],
		Kick: [],
		Jail: [],
		JobBan: [],
		CarBan: [],
	};

	let dayPunishments = {
		Alle: [],
		Ban: [],
		Kick: [],
		Jail: [],
		JobBan: [],
		CarBan: [],
	};

	for (let elt of punishments) {
		if (elt.style.textDecoration == "line-through") {
			continue;
		}

		let time = elt.children[0].textContent;
		let type = elt.children[1].textContent;

		if (skip.includes(type)) {
			continue;
		}

		let filterSkip = true;

		for (let elt2 of elt.children) {
			if (
				elt2.textContent.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
			) {
				filterSkip = false;

				break;
			}
		}

		if (filterSkip) {
			continue;
		}

		let date = new Date(time.replace(/(\d{2})-(\d{2})-(\d{2})/, "$2/$1/$3"));

		allPunishments.Alle.push(elt);
		allPunishments[type].push(elt);

		if (date > monthRange) {
			monthPunishments.Alle.push(elt);
			monthPunishments[type].push(elt);
		}

		if (date > weekRange) {
			weekPunishments.Alle.push(elt);
			weekPunishments[type].push(elt);
		}

		if (date > dayRange) {
			dayPunishments.Alle.push(elt);
			dayPunishments[type].push(elt);
		}
	}

	for (let key in allPunishments) {
		if (allPunishments.hasOwnProperty(key)) {
			if (allPunishments[key].length > 0) {
				let td = document.createElement("td");

				let a = document.createElement("a");
				a.setAttribute("data-toggle", "modal");
				a.setAttribute("data-target", "#punishmentsModal");
				a.style.color = "inherit";
				a.style["text-decoration"] = "underline";
				a.textContent = allPunishments[key].length;
				a.addEventListener(
					"click",
					punishmentsClickEventListener.bind(
						null,
						key,
						"Altid",
						modalTitle,
						modalTable,
						allPunishments
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
	}

	for (let key in monthPunishments) {
		if (monthPunishments.hasOwnProperty(key)) {
			if (monthPunishments[key].length > 0) {
				let td = document.createElement("td");

				let a = document.createElement("a");
				a.setAttribute("data-toggle", "modal");
				a.setAttribute("data-target", "#punishmentsModal");
				a.style.color = "inherit";
				a.style["text-decoration"] = "underline";
				a.textContent = monthPunishments[key].length;
				a.addEventListener(
					"click",
					punishmentsClickEventListener.bind(
						null,
						key,
						"Seneste måned",
						modalTitle,
						modalTable,
						monthPunishments
					)
				);

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
		if (weekPunishments.hasOwnProperty(key)) {
			if (weekPunishments[key].length > 0) {
				let td = document.createElement("td");

				let a = document.createElement("a");
				a.setAttribute("data-toggle", "modal");
				a.setAttribute("data-target", "#punishmentsModal");
				a.style.color = "inherit";
				a.style["text-decoration"] = "underline";
				a.textContent = weekPunishments[key].length;
				a.addEventListener(
					"click",
					punishmentsClickEventListener.bind(
						null,
						key,
						"Seneste uge",
						modalTitle,
						modalTable,
						weekPunishments
					)
				);

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
		if (dayPunishments.hasOwnProperty(key)) {
			if (dayPunishments[key].length > 0) {
				let td = document.createElement("td");

				let a = document.createElement("a");
				a.setAttribute("data-toggle", "modal");
				a.setAttribute("data-target", "#punishmentsModal");
				a.style.color = "inherit";
				a.style["text-decoration"] = "underline";
				a.textContent = dayPunishments[key].length;
				a.addEventListener(
					"click",
					punishmentsClickEventListener.bind(
						null,
						key,
						"Seneste døgn",
						modalTitle,
						modalTable,
						dayPunishments
					)
				);

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
	modal.style = "display: none;";
	modal.innerHTML = `<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>
				<h4 class="modal-title" style="color:white;"></h4>
			</div>
			<div class="modal-body" style="color:white;font-size:15px;">
				<table class="table table_sortable {sortlist: [[0,0]]}" cellspacing="0" width="100%">
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
			<div class="panel-heading" style="background-color:#16a085;border-bottom-color:white;">
				<h3 class="panel-title">Strafoverblik</h3>
			</div>

			<div class="panel-body">
				<input class="form-control" type="text" placeholder="Filter..">
				<div class="template__table_static template__table_responsive">
					<div class="scrollable">
						<table class="table table_sortable {sortlist: [[0,0]]}" cellspacing="0" width="100%">
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

	let filter = container.querySelector("input");
	let tbody = container.querySelector("tbody");

	cont.appendChild(container);
	punishmentsRow.before(container);

	filter.addEventListener(
		"keyup",
		punishmentsCreate.bind(null, modal, filter, tbody)
	);

	punishmentsCreate(modal, filter, tbody);
}
