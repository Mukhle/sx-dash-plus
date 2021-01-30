const [information, steamidParts] = getLookupContainerFromHeaderText(
	"Spillerinformation",
	(elt) => {
		let paragraphs = elt.parentElement.parentElement.querySelectorAll(
			"div.panel-body > p"
		);

		for (let pb of paragraphs) {
			let match = pb.textContent.match(/STEAM_0:(\d):(\d+)/);

			if (match) {
				return [pb, match];
			}
		}
	}
);

if (information) {
	const communityID =
		BigInt(steamidParts[2]) * BigInt(2) +
		BigInt(76561197960265728) +
		BigInt(steamidParts[1]);

	let steamProfile = document.createElement("a");
	steamProfile.href = `http://steamcommunity.com/profiles/${communityID}`;
	steamProfile.target = "_blank";
	steamProfile.innerHTML = `<button type="button" class="btn btn-default pull-right" style="color:white;">Steam Profil</button>`;

	information.appendChild(steamProfile);

	let friendsList = document.createElement("a");
	friendsList.href = `http://steamcommunity.com/profiles/${communityID}/friends/`;
	friendsList.target = "_blank";
	friendsList.innerHTML = `<button type="button" class="btn btn-default pull-right" style="color:white;">Venneliste</button>`;

	information.appendChild(friendsList);
}
