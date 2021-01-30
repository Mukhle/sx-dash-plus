let reference = document.querySelector("#rulecat-1");

let container = document.createElement("div");
container.className = "row";
container.innerHTML = `<div class="col-md-12 col-xs-12" style="margin-bottom:10px;"></div>`;

function hideClickEventListener() {
	for (let elt of document.querySelectorAll('[id^="rulecat"] .panel-body.in')) {
		elt.parentElement.querySelector('[role="button"]').click();
	}
}

let hide = document.createElement("a");
hide.className = "btn btn-default";
hide.style = "margin-right:2px;margin-bottom:2px;";
hide.innerText = `Skjul alle`;
hide.addEventListener("click", hideClickEventListener.bind(null));

container.firstChild.appendChild(hide);

function showClickEventListener() {
	for (let elt of document.querySelectorAll(
		'[id^="rulecat"] .panel-body:not(.in)'
	)) {
		elt.parentElement.querySelector('[role="button"]').click();
	}
}

let show = document.createElement("a");
show.className = "btn btn-default";
show.style = "margin-right:2px;margin-bottom:2px;";
show.innerText = `Vis alle`;
show.addEventListener("click", showClickEventListener.bind(null));

container.firstChild.appendChild(show);

reference.parentNode.insertBefore(container, reference);
