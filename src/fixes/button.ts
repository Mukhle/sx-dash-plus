function confirmClickEventListener(evalString: string, modal: HTMLDivElement) {
	const modalButton = modal.querySelector('button.btn.btn-danger');
	if (modalButton === null) return;

	modalButton.setAttribute('onclick', evalString);
}

export function removeTableRowListeners(root: HTMLElement) {
	//Some fuckery was happening with the click event listeners when running the function immediately
	setTimeout(() => {
		const cont = document.querySelector('.template.template__controls');
		if (cont === null) return;

		const modal = document.createElement('div');
		modal.className = 'modal fade';
		modal.id = 'modal-confirm-sxplus';
		modal.style.setProperty('display', 'none');
		modal.innerHTML = `<div class="modal-dialog">
			<div class="modal-content">
				<div class='modal-header'>
					<button type='button' data-dismiss='modal' aria-label='Close' class='close'><span aria-hidden='true'>×</span></button>
					<h4 class='modal-title' style='color:white;'>Bekræft handling</h4>
				</div>
				<div class="modal-body">
					Du er ved at strege denne straf ud. Dette markere straffen som ugyldiggjort. Det er ikke muligt at fortryde handlingen.
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Annuller</button>
					<button type="button" class="btn btn-danger">Bekræft</a>
				</div>
			</div>
		</div>`;

		cont.appendChild(modal);

		for (const element of root.querySelectorAll<HTMLTableDataCellElement>('.table > tbody > tr > td:nth-child(6) > button')) {
			const functionString = element.getAttribute('onclick');
			if (functionString === null) return;

			const button = document.createElement('i');
			button.className = 'fa fa-strikethrough button-sxplus';
			button.title = 'Streg hændelsen ud.';
			button.setAttribute('data-toggle', 'modal');
			button.setAttribute('data-target', '#modal-confirm-sxplus');
			button.style.setProperty('color', '#e74c3c');
			button.addEventListener('click', () => {
				confirmClickEventListener(functionString, modal);
			});

			element.replaceWith(button);
		}
	});
}

export const execute = async () => {
	removeTableRowListeners(document.documentElement);
};

execute();
