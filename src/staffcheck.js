let user_is_staff = false;

for (const a of document.querySelectorAll(".sidebar__title")) {
	if (a.textContent == "Staff") {
		user_is_staff = true;

		break;
	}
}
