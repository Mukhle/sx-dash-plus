const blacklistedLookup = ["STEAM_0:1:48016748","STEAM_0:0:56939043"]

if(user_is_staff) {
	for(let elt of document.querySelectorAll("div.users-preview__cont")) {
		let steamid = elt.querySelector(".users-preview__status");

		if(steamid) {
			let match = steamid.textContent.match(/STEAM_0:\d:\d+/);

			if(match && !blacklistedLookup.includes(match[0])) {
				let cont = elt.querySelector(".users-preview__props");

				let button = document.createElement('div');
				button.className = "users-preview__prop";
				button.innerHTML = `<a href="https://stavox.dk/dash/lookup?lookupid=${match[0]}" target="_blank"><i class="fa fa-search"></i><span class="users-preview__status" title="Lookup"><b>Lookup</b></span></a>`

				cont.appendChild(button);
			}
		}
	}
}
