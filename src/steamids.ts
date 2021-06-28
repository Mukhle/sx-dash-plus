import { userIsStaff, processTextNodes } from "./lookup/shared";

if (userIsStaff) {
	processTextNodes(document.body);
}
