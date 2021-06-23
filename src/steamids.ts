import { processDocument } from "./lookup/shared";
import user_is_staff from "./staffcheck";

if (user_is_staff) {
	processDocument(document.body);
}
