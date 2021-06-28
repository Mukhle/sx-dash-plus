import { user_is_staff } from "./lookup/shared";

if (user_is_staff) {
	const lookupField = document.querySelector("#lookupid");

	if (!lookupField) {
		const mainHeading = document.querySelector(".main-heading");

		if (mainHeading) {
			const breadcrumb = mainHeading?.querySelector(".breadcrumb");

			if (breadcrumb) {
				const mainTitle = document.createElement("div");
				mainTitle.className = "main-title";

				breadcrumb.parentNode?.insertBefore(mainTitle, breadcrumb);
				mainTitle.appendChild(breadcrumb);
			} else {
				const mainTitle = document.createElement("div");
				mainTitle.className = "main-title";
				mainTitle.innerHTML = `<ol class='breadcrumb'>
					<li class='active'>Spilleropslag</li>
				</ol>`;

				mainHeading.appendChild(mainTitle);
			}

			const search = document.createElement("div");
			search.className = "main-filter";
			search.innerHTML = `<form class='main-filter__search' target='_blank' method='get' action='lookup' onsubmit='this.submit(); this.reset(); return false;'>
				<div class='input-group'>
					<input type='text' id='lookupid' name='lookupid' placeholder='Søg på SteamID/Navn' class='form-control'>
					<span class='input-group-btn'>
						<button type='submit' class='btn btn-default'>
							<div class='fa fa-search'></div>
						</button>
					</span>
				</div>
			</form>`;

			mainHeading.appendChild(search);
		} else {
			const mainCont = document.querySelector(".main__cont");

			if (mainCont) {
				const search = document.createElement("div");
				search.className = "main-heading";
				search.innerHTML = `<div class='main-title'>
					<ol class='breadcrumb'>
						<li class='active'>Spilleropslag</li>
					</ol>
				</div>
				<div class='main-filter'>
					<form class='main-filter__search' target='_blank' method='get' action='lookup' onsubmit='this.submit(); this.reset(); return false;'>
						<div class='input-group'>
							<input type='text' id='lookupid' name='lookupid' placeholder='Søg på SteamID/Navn' class='form-control'>
							<span class='input-group-btn'>
								<button type='submit' class='btn btn-default'>
									<div class='fa fa-search'></div>
								</button>
							</span>
						</div>
					</form>
				</div>`;

				mainCont.insertBefore(search, mainCont.firstChild);
			}
		}
	}
}
