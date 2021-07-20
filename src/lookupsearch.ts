import { userIsStaff } from './lookup/shared';

export const execute = async () => {
	if (userIsStaff) {
		const lookupField = document.querySelector('#lookupid');

		if (lookupField === null) {
			const mainHeading = document.querySelector('.main-heading.lookuptop');

			if (mainHeading) {
				const breadcrumb = mainHeading.querySelector('.breadcrumb');

				if (breadcrumb) {
					const mainTitle = document.createElement('div');
					mainTitle.classList.add('main-title');

					breadcrumb.parentNode?.insertBefore(mainTitle, breadcrumb);
					mainTitle.appendChild(breadcrumb);
				} else {
					const mainTitle = document.createElement('div');
					mainTitle.classList.add('main-title');
					mainTitle.innerHTML = `<ol class="breadcrumb">
						<li class="active">Spilleropslag</li>
					</ol>`;

					mainHeading.appendChild(mainTitle);
				}

				const search = document.createElement('div');
				search.classList.add('main-filter');
				search.innerHTML = `<form class="main-filter__search" method="get" action="lookup">
					<div class="input-group">
						<input type="text" id="lookupid" name="lookupid" autocomplete="off" placeholder="Søg efter SteamID, RP navn eller Steam profillink" class="form-control">
						<span class="input-group-btn">
							<button type="submit" class="btn btn-default">
								<div class="fa fa-search"></div>
							</button>
						</span>
					</div>
				</form>`;

				mainHeading.appendChild(search);
			} else {
				const mainCont = document.querySelector('.main__cont');

				if (mainCont) {
					const search = document.createElement('div');
					search.classList.add('main-heading');
					search.classList.add('lookuptop');
					search.innerHTML = `<div class="main-title">
						<ol class="breadcrumb">
							<li class="active">Spilleropslag</li>
						</ol>
					</div>
					<div class="main-filter">
						<form class="main-filter__search" method="get" action="lookup">
							<div class="input-group">
								<input type="text" id="lookupid" name="lookupid" autocomplete="off" placeholder="Søg efter SteamID, RP navn eller Steam profillink" class="form-control">
								<span class="input-group-btn">
									<button type="submit" class="btn btn-default">
										<div class="fa fa-search"></div>
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
};

execute();
