import { user_is_staff, processDocument } from "./lookup/shared";

if (user_is_staff) {
	processDocument(document.body);
}
