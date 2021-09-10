function confirmClickEventListener(evalString: string) {
	const modal = document.querySelector<HTMLDivElement>('#modal-button-confirm-sxplus')
	if (modal === null) return

	const modalButton = modal.querySelector<HTMLButtonElement>('button.btn.btn-danger')
	if (modalButton === null) return

	modalButton.setAttribute('onclick', evalString)
}

export function confirmCreate(): void {
	for (const element of document.querySelectorAll<HTMLButtonElement>('.table > tbody > tr > td:nth-child(6) > button')) {
		const evalString = element.getAttribute('onclick')
		if (evalString === null) return

		const button = document.createElement('i')
		button.className = 'fa fa-strikethrough button-sxplus'
		button.title = 'Streg hændelsen ud.'
		button.style.setProperty('color', '#e74c3c')
		button.setAttribute('data-toggle', 'modal')
		button.setAttribute('data-target', '#modal-button-confirm-sxplus')
		button.addEventListener('click', () => {
			confirmClickEventListener(evalString)
		})

		element.replaceWith(button)
	}
}

export async function execute(): Promise<void> {
	//Some fuckery was happening with the click event listeners when running the function immediately
	setTimeout(() => {
		const cont = document.querySelector<HTMLDivElement>('.template.template__controls')
		if (cont === null) return

		const modal = document.createElement('div')
		modal.className = 'modal fade'
		modal.id = 'modal-button-confirm-sxplus'
		modal.style.setProperty('display', 'none')
		modal.innerHTML = `<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>
					<h4 class="modal-title" style="color:white;">Bekræft handling</h4>
				</div>
				<div class="modal-body">
					Du er ved at strege denne straf ud. Dette markere straffen som ugyldiggjort. Det er ikke muligt at fortryde handlingen senere.
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Annuller</button>
					<button type="button" class="btn btn-danger">Bekræft</a>
				</div>
			</div>
		</div>`

		cont.appendChild(modal)

		confirmCreate()
	})
}

execute()
