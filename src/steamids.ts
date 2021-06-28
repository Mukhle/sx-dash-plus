import { user_is_staff, processTextNodes } from "./lookup/shared";

if (user_is_staff) {
	processTextNodes(document.body);
}
