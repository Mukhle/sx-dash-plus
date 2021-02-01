const [information, steamidParts] = getLookupContainerFromHeaderText(
	"Spillerinformation",
	(elt) => {
		const paragraphs = elt.parentElement.parentElement.querySelectorAll(
			"div.panel-body > p"
		);

		for (const pb of paragraphs) {
			const match = pb.textContent.match(/STEAM_0:(\d):(\d+)/);

			if (match) {
				return [pb, match];
			}
		}
	}
) ?? [null, null];

if (information) {
	const communityID =
		BigInt(steamidParts[2]) * BigInt(2) +
		BigInt(76561197960265728) +
		BigInt(steamidParts[1]);

	const buttons = document.querySelectorAll("a.btn");
	const uglybutton = Array.from(buttons).find((button) => {
		return button.innerText.includes("Steam profil");
	});

	if (uglybutton) {
		const steamProfile = document.createElement("a");
		steamProfile.href = `http://steamcommunity.com/profiles/${communityID}`;
		steamProfile.target = "_blank";
		steamProfile.className = "btn btn-default pull-right";
		steamProfile.style["color"] = "white";
		steamProfile.style["margin-left"] = "10px";
		steamProfile.innerHTML = `<i class="fa fa-steam" style="margin-right: 10px;"></i>Steam Profil`;

		information.appendChild(steamProfile);

		const friendsList = document.createElement("a");
		friendsList.href = `http://steamcommunity.com/profiles/${communityID}/friends/`;
		friendsList.target = "_blank";
		friendsList.className = "btn btn-default pull-right";
		friendsList.style["color"] = "white";
		friendsList.innerHTML = `<i class="fa fa-steam" style="margin-right: 10px;"></i>Venneliste`;

		information.appendChild(friendsList);

		uglybutton.remove();
	}
}
