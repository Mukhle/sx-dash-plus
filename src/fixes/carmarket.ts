function confirmClickEventListener(evalString: string) {
	const modal = document.querySelector<HTMLDivElement>('#modal-carmarket-confirm-sxplus')
	if (modal === null) return

	const modalButton = modal.querySelector<HTMLButtonElement>('button.btn.btn-danger')
	if (modalButton === null) return

	modalButton.setAttribute('onclick', evalString)
}

export function confirmCreate(): void {
	for (const element of document.querySelectorAll<HTMLButtonElement>('.users-preview__edit button.btn.btn-success')) {
		const evalString = element.getAttribute('onclick')
		if (evalString === null) continue

		element.removeAttribute('onclick')

		const clone = element.cloneNode(true) as HTMLButtonElement
		clone.setAttribute('data-toggle', 'modal')
		clone.setAttribute('data-target', '#modal-carmarket-confirm-sxplus')
		clone.addEventListener('click', () => {
			confirmClickEventListener(evalString)
		})

		element.replaceWith(clone)
	}
}

export async function execute(): Promise<void> {
	//Some fuckery was happening with the click event listeners when running the function immediately
	setTimeout(() => {
		const cont = document.querySelector<HTMLDivElement>('.pages.pages_dashboard')
		if (cont === null) return

		const modal = document.createElement('div')
		modal.className = 'modal fade'
		modal.id = 'modal-carmarket-confirm-sxplus'
		modal.style.setProperty('display', 'none')
		modal.innerHTML = `<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>
					<h4 class="modal-title" style="color:white;">Bekræft handling</h4>
				</div>
				<div class="modal-body">
					Du er ved at købe en bil. Det er ikke muligt at fortryde handlingen senere.
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
