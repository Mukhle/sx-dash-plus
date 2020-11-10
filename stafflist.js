if(user_is_staff) {
	for(let elt of document.querySelectorAll("div.users-preview__cont")) {
		let steamid = elt.querySelector(".users-preview__status");

		if(steamid) {
			let match = steamid.textContent.match(/STEAM_0:\d:\d+/);

			if(match) {
				let button = elt.querySelector(".btn-danger");

				if(match[0] == "STEAM_0:1:48016748") {
					button.classList.add("disabled");
					button.innerText = `NoLookup`;
				}else {
					button.href = `https://stavox.dk/dash/lookup?lookupid=${match[0]}`;
					button.target = "_blank";
					button.innerText = `Lookup`;
				}
			}
		}
	}
}
