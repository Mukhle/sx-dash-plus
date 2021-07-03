import { getLookupContainerFromHeaderText } from "./shared";

const [buttongroup, steamidParts] = getLookupContainerFromHeaderText(
	"Spillerinformation",
	(element: HTMLElement) => {
		const group = element.parentElement?.parentElement?.querySelector("div.btn-group");

		if (group === undefined) return;

		const paragraphs = element.parentElement?.parentElement?.querySelectorAll("p > strong");

		if (paragraphs === undefined) return;

		for (const pb of paragraphs) {
			const match = pb.parentElement?.textContent?.match(/STEAM_\d:(\d):(\d+)/);

			if (match) return [group, match];
		}
	},
	[null, null]
);

if (buttongroup) {
	const communityID =
		BigInt(steamidParts[2]) * BigInt(2) + BigInt(76561197960265728) + BigInt(steamidParts[1]);

	document.querySelectorAll<HTMLButtonElement>("a.btn").forEach((element) => {
		if (element.innerText === "Steam profil") {
			element.remove();
		}
	});

	const steamProfile = document.createElement("a");
	steamProfile.href = `http://steamcommunity.com/profiles/${communityID}`;
	steamProfile.target = "_blank";
	steamProfile.className = "btn btn-default";
	steamProfile.style["color"] = "white";
	steamProfile.innerHTML = `<i class='fa fa-steam' style='margin-right: 10px;'></i>Steam Profil`;

	buttongroup.appendChild(steamProfile);

	const friendsList = document.createElement("a");
	friendsList.href = `http://steamcommunity.com/profiles/${communityID}/friends/`;
	friendsList.target = "_blank";
	friendsList.className = "btn btn-default";
	friendsList.style["color"] = "white";
	friendsList.innerHTML = `<i class='fa fa-steam' style='margin-right: 10px;'></i>Venneliste`;

	buttongroup.appendChild(friendsList);
}
