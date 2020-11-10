const cont = document.querySelector("body > div > div > div.main > div > div.container-fluid.half-padding > div");
var steamidParts;
var information;
var punishments;
var notes;

for(let elt of document.querySelectorAll("#idblockview tbody > tr")) {
	elt.removeAttribute("onclick");

	var clone = elt.cloneNode(true);
	elt.parentNode.replaceChild(clone, elt);

	let steamid = clone.children[0];

	if(steamid.style.color != "rgb(237, 73, 73)") {
		let match = steamid.textContent.match(/STEAM_0:\d:\d+/);

		if(match) {
			steamid.innerHTML = '';

			let a = document.createElement('a');
			a.href = `https://stavox.dk/dash/lookup?lookupid=${match[0]}`;
			a.textContent = match[0];
			a.style.color = "inherit";
			a.style["text-decoration"] = "underline";

			steamid.appendChild(a);
		}
	}
}

for(let elt of document.querySelectorAll("#ipblockview tbody > tr")) {
	elt.removeAttribute("onclick");

	var clone = elt.cloneNode(true);
	elt.parentNode.replaceChild(clone, elt);

	let steamid = clone.children[0];

	if(steamid.style.color != "rgb(237, 73, 73)") {
		let match = steamid.textContent.match(/STEAM_0:\d:\d+/);

		if(match) {
			steamid.innerHTML = '';

			let a = document.createElement('a');
			a.href = `https://stavox.dk/dash/lookup?lookupid=${match[0]}`;
			a.textContent = match[0];
			a.style.color = "inherit";
			a.style["text-decoration"] = "underline";

			steamid.appendChild(a);
		}
	}
}

for(let elt of document.querySelectorAll("h3.panel-title")) {
	if(elt.textContent == "Spillerinformation") {
		let paragraphs = elt.parentElement.parentElement.querySelectorAll("div.panel-body > p");

		for(let pb of paragraphs) {
			let match = pb.textContent.match(/STEAM_0:(\d):(\d+)/);

			if(match) {
				steamidParts = match;
				information = pb;

				break;
			}
		}
	}else if(elt.textContent == "Strafhistorik - Ældste er øverst") {
		punishments = elt.parentElement.parentElement.querySelector("tbody").children;
	}else if(elt.textContent == "Noter") {
		notes = elt.parentElement.parentElement.querySelector("div.sp-widget > div > div > div.sp-widget__list").children;
	}
}

if(information) {
	const communityID = BigInt(steamidParts[2]) * BigInt(2) + BigInt(76561197960265728) + BigInt(steamidParts[1]);

	let steamProfile = document.createElement('a');
	steamProfile.href = `http://steamcommunity.com/profiles/${communityID}`;
	steamProfile.target = "_blank";
	steamProfile.innerHTML = `<button type="button" class="btn btn-default pull-right" style="color:white;">Steam Profil</button>`;

	information.appendChild(steamProfile);

	let friendsList = document.createElement('a');
	friendsList.href = `http://steamcommunity.com/profiles/${communityID}/friends/`;
	friendsList.target = "_blank";
	friendsList.innerHTML = `<button type="button" class="btn btn-default pull-right" style="color:white;">Venneliste</button>`;

	information.appendChild(friendsList);
}

const now = new Date();
const monthRange = deltaDate(now, 0, -1, 0);
const weekRange = deltaDate(now, -7, 0, 0);
const dayRange = deltaDate(now, -1, 0, 0);

function deltaDate(input, days, months, years) {
	return new Date(
		input.getFullYear() + years,
		input.getMonth() + months,
		Math.min(
			input.getDate() + days,
			new Date(input.getFullYear() + years, input.getMonth() + months + 1, 0).getDate()
		)
	);
}

function punishmentsClickEventListener(type, period, titleElement, tableElement, array) {
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
		"Alle": [],
		"Ban": [],
		"Kick": [],
		"Jail": [],
		"JobBan": [],
		"CarBan": []
	};

	let monthPunishments = {
		"Alle": [],
		"Ban": [],
		"Kick": [],
		"Jail": [],
		"JobBan": [],
		"CarBan": []
	};

	let weekPunishments = {
		"Alle": [],
		"Ban": [],
		"Kick": [],
		"Jail": [],
		"JobBan": [],
		"CarBan": []
	};

	let dayPunishments = {
		"Alle": [],
		"Ban": [],
		"Kick": [],
		"Jail": [],
		"JobBan": [],
		"CarBan": []
	};

	for (let elt of punishments) {
		let admin = elt.children[3];
		let match = admin.textContent.match(/STEAM_0:\d:\d+/);

		if(match) {
			admin.innerHTML = '';

			let a = document.createElement('a');
			a.href = `https://stavox.dk/dash/lookup?lookupid=${match[0]}`;
			a.textContent = match[0];
			a.style.color = "inherit";
			a.style["text-decoration"] = "underline";

			admin.appendChild(a);
		}

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
			if(elt2.textContent.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) {
				filterSkip = false;

				break;
			}
		}

		if(filterSkip) {
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
		if(allPunishments.hasOwnProperty(key)) {
			if(allPunishments[key].length > 0) {
				let td = document.createElement('td');

				let a = document.createElement('a');
				a.setAttribute("data-toggle","modal");
				a.setAttribute("data-target","#punishmentsModal");
				a.style.color = "inherit";
				a.style["text-decoration"] = "underline";
				a.textContent = allPunishments[key].length;
				a.addEventListener('click', punishmentsClickEventListener.bind(null, key, "Altid", modalTitle, modalTable, allPunishments));

				td.appendChild(a);
				tbody.children[0].appendChild(td);
			}else {
				let td = document.createElement('td');
				td.textContent = "0";
				tbody.children[0].appendChild(td);
			}
		}
	}

	for (let key in monthPunishments) {
		if(monthPunishments.hasOwnProperty(key)) {
			if(monthPunishments[key].length > 0) {
				let td = document.createElement('td');

				let a = document.createElement('a');
				a.setAttribute("data-toggle","modal");
				a.setAttribute("data-target","#punishmentsModal");
				a.style.color = "inherit";
				a.style["text-decoration"] = "underline";
				a.textContent = monthPunishments[key].length;
				a.addEventListener('click', punishmentsClickEventListener.bind(null, key, "Seneste måned", modalTitle, modalTable, monthPunishments));

				td.appendChild(a);
				tbody.children[1].appendChild(td);
			}else {
				let td = document.createElement('td');
				td.textContent = "0";
				tbody.children[1].appendChild(td);
			}
		}
	}

	for (let key in weekPunishments) {
		if(weekPunishments.hasOwnProperty(key)) {
			if(weekPunishments[key].length > 0) {
				let td = document.createElement('td');

				let a = document.createElement('a');
				a.setAttribute("data-toggle","modal");
				a.setAttribute("data-target","#punishmentsModal");
				a.style.color = "inherit";
				a.style["text-decoration"] = "underline";
				a.textContent = weekPunishments[key].length;
				a.addEventListener('click', punishmentsClickEventListener.bind(null, key, "Seneste uge", modalTitle, modalTable, weekPunishments));

				td.appendChild(a);
				tbody.children[2].appendChild(td);
			}else {
				let td = document.createElement('td');
				td.textContent = "0";
				tbody.children[2].appendChild(td);
			}
		}
	}

	for (let key in dayPunishments) {
		if(dayPunishments.hasOwnProperty(key)) {
			if(dayPunishments[key].length > 0) {
				let td = document.createElement('td');

				let a = document.createElement('a');
				a.setAttribute("data-toggle","modal");
				a.setAttribute("data-target","#punishmentsModal");
				a.style.color = "inherit";
				a.style["text-decoration"] = "underline";
				a.textContent = dayPunishments[key].length;
				a.addEventListener('click', punishmentsClickEventListener.bind(null, key, "Seneste døgn", modalTitle, modalTable, dayPunishments));

				td.appendChild(a);
				tbody.children[3].appendChild(td);
			}else {
				let td = document.createElement('td');
				td.textContent = "0";
				tbody.children[3].appendChild(td);
			}
		}
	}
}

if(punishments) {
	let modal = document.createElement('div');
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

	let container = document.createElement('div');
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

	filter.addEventListener('keyup', punishmentsCreate.bind(null, modal, filter, tbody));

	punishmentsCreate(modal, filter, tbody);
}

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
	<tr style="">
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
			if(text.textContent.toLowerCase().indexOf(filter.value.toLowerCase()) == -1) {
				continue;
			}

			let time = user.textContent.match(/\d{2}-\d{2}-\d{2} \d{2}:\d{2}/);

			if(time) {
				let date = new Date(time[0].replace(/(\d{2})-(\d{2})-(\d{2})/, "$2/$1/$3"));

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

	if(allNotes.length > 0) {
		let td = document.createElement('td');

		let a = document.createElement('a');
		a.setAttribute("data-toggle","modal");
		a.setAttribute("data-target","#notesModal");
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";
		a.textContent = allNotes.length;
		a.addEventListener('click', notesClickEventListener.bind(null, "Altid", modalTitle, modalList, allNotes));

		td.appendChild(a);
		tbody.children[0].appendChild(td);
	}else {
		let td = document.createElement('td');
		td.textContent = "0";
		tbody.children[0].appendChild(td);
	}

	if(monthNotes.length > 0) {
		let td = document.createElement('td');

		let a = document.createElement('a');
		a.setAttribute("data-toggle","modal");
		a.setAttribute("data-target","#notesModal");
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";
		a.textContent = monthNotes.length;
		a.addEventListener('click', notesClickEventListener.bind(null, "Seneste måned", modalTitle, modalList, monthNotes));

		td.appendChild(a);
		tbody.children[0].appendChild(td);
	}else {
		let td = document.createElement('td');
		td.textContent = "0";
		tbody.children[0].appendChild(td);
	}

	if(weekNotes.length > 0) {
		let td = document.createElement('td');

		let a = document.createElement('a');
		a.setAttribute("data-toggle","modal");
		a.setAttribute("data-target","#notesModal");
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";
		a.textContent = weekNotes.length;
		a.addEventListener('click', notesClickEventListener.bind(null, "Seneste uge", modalTitle, modalList, weekNotes));

		td.appendChild(a);
		tbody.children[0].appendChild(td);
	}else {
		let td = document.createElement('td');
		td.textContent = "0";
		tbody.children[0].appendChild(td);
	}

	if(dayNotes.length > 0) {
		let td = document.createElement('td');

		let a = document.createElement('a');
		a.setAttribute("data-toggle","modal");
		a.setAttribute("data-target","#notesModal");
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";
		a.textContent = dayNotes.length;
		a.addEventListener('click', notesClickEventListener.bind(null, "Seneste døgn", modalTitle, modalList, dayNotes));

		td.appendChild(a);
		tbody.children[0].appendChild(td);
	}else {
		let td = document.createElement('td');
		td.textContent = "0";
		tbody.children[0].appendChild(td);
	}
}

if(notes) {
	let modal = document.createElement('div');
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

	let container = document.createElement('div');
	container.className = "row";
	container.innerHTML = `<div class="col-md-12 col-xs-11">
		<div class="panel panel-danger">
			<div class="panel-heading" style="background-color:#16a085;border-bottom-color:white;">
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

	filter.addEventListener('keyup', notesCreate.bind(null, modal, filter, tbody));

	notesCreate(modal, filter, tbody);
}
