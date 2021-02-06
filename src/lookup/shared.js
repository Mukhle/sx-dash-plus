const cont = document.querySelector(
	"body > div > div > div.main > div > div.container-fluid.half-padding > div"
);

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
			new Date(
				input.getFullYear() + years,
				input.getMonth() + months + 1,
				0
			).getDate()
		)
	);
}

const headers = document.querySelectorAll("h3.panel-title");
const getLookupContainerFromHeaderText = (headerText, getReturnValue, defaults) => {
	for (let elt of headers) {
		if (elt.textContent?.includes(headerText)) {
			return getReturnValue(elt) ?? defaults;
		}
	}
};
