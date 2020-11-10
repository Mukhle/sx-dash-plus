if(user_is_staff) {
	const maincont = document.querySelector(".main__cont");

	if(maincont) {
		let search = document.createElement('div');
		search.className = "main-heading";
		search.style = "display: block;";
		search.innerHTML = `<div class="main-title">
			<ol class="breadcrumb">
				<li class="active">Spilleropslag</li>
			</ol>
		</div>
		<div class="main-filter">
			<form class="main-filter__search" target="_blank" method="get" action="lookup" onsubmit="this.submit(); this.reset(); return false;">
				<div class="input-group">
					<input type="text" id="lookupid" name="lookupid" placeholder="Søg på SteamID/Navn" class="form-control" autocomplete="off" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAPhJREFUOBHlU70KgzAQPlMhEvoQTg6OPoOjT+JWOnRqkUKHgqWP4OQbOPokTk6OTkVULNSLVc62oJmbIdzd95NcuGjX2/3YVI/Ts+t0WLE2ut5xsQ0O+90F6UxFjAI8qNcEGONia08e6MNONYwCS7EQAizLmtGUDEzTBNd1fxsYhjEBnHPQNG3KKTYV34F8ec/zwHEciOMYyrIE3/ehKAqIoggo9inGXKmFXwbyBkmSQJqmUNe15IRhCG3byphitm1/eUzDM4qR0TTNjEixGdAnSi3keS5vSk2UDKqqgizLqB4YzvassiKhGtZ/jDMtLOnHz7TE+yf8BaDZXA509yeBAAAAAElFTkSuQmCC&quot;); background-repeat: no-repeat; background-attachment: scroll; background-size: 16px 18px; background-position: 98% 50%;">
					<span class="input-group-btn">
						<button type="submit" class="btn btn-default">
							<div class="fa fa-search"></div>
						</button>
					</span>
				</div>
			</form>
		</div>`;

		maincont.insertBefore(search,maincont.firstChild)
	}
}
