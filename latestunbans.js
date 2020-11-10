for(let elt of document.querySelectorAll("tbody > tr")) {
	let banned_steamid = elt.children[0];
	let banned_match = banned_steamid.textContent.match(/STEAM_0:\d:\d+/);

	if(banned_match) {
		banned_steamid.innerHTML = '';

		let a = document.createElement('a');
		a.href = `https://stavox.dk/dash/lookup?lookupid=${banned_match[0]}`;
		a.textContent = banned_match[0];
		a.style.color = "inherit";
		a.style["text-decoration"] = "underline";

		banned_steamid.appendChild(a);
	}
}
