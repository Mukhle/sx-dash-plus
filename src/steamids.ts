import { userIsStaff, processTextNodes } from "./lookup/shared";

export const execute = async () => {
	if (userIsStaff) {
		processTextNodes(document.body);
	}
};

execute();
