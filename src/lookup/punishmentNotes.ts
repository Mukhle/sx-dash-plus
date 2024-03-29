import { getLookupContainerFromHeaderText } from './shared'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { skipNoteUsers } from '../shared'
dayjs.extend(customParseFormat)

function createNotesLink(punishments: HTMLTableRowElement[], notes: HTMLDivElement[]) {
	const noteTextEntry = document.querySelector<HTMLTextAreaElement>('#notetext')
	if (noteTextEntry === null) return

	for (const punishmentRow of punishments) {
		const type = punishmentRow.children[1].textContent
		if (type === null) continue

		const punishmentTime = punishmentRow.children[0].textContent
		if (punishmentTime === null) continue

		const punishmentDate = dayjs(punishmentTime, 'DD-MM-YY HH:mm:ss')

		const buttonCell = punishmentRow.children[5]
		if (buttonCell === null) continue

		for (const noteEntry of notes) {
			const [noteHeadingElement, noteContentsElement] = noteEntry.children as HTMLCollectionOf<HTMLDivElement>
			if (noteHeadingElement === null || noteContentsElement === null) continue

			const noteHeading = noteHeadingElement.textContent
			if (noteHeading === null || noteHeading === 'Ingen noter') continue

			const noteContents = noteContentsElement.textContent
			if (noteContents === null) continue

			const [noteAuthor, noteTime] = noteHeading.split(',')

			const skipUser = skipNoteUsers.some((username) => noteAuthor.includes(username))
			if (skipUser) continue

			if (noteContents.includes(punishmentTime)) {
				const button = document.createElement('i')
				button.className = 'fa fa-link button-sxplus'
				button.title = 'Gå til note, som indeholder det tidspunkt, hvor hændelsen blev registreret.'
				button.style.setProperty('color', '#6ab04c')
				button.addEventListener('click', () => {
					noteEntry.scrollIntoView({
						'behavior': 'smooth',
						'block': 'center',
					})

					noteEntry.classList.add('pulse')
					noteEntry.addEventListener('animationend', ({ animationName }) => {
						if (animationName === 'pulse') {
							noteEntry.classList.remove('pulse')
						}
					})
				})

				buttonCell.prepend(button)
			} else {
				const skipUser = skipNoteUsers.some((username) => noteAuthor.includes(username))
				if (skipUser) continue

				const noteDate = dayjs(noteTime, 'DD-MM-YY HH:mm')
				const dateDiff = noteDate.diff(punishmentDate, 'minute')

				if (dateDiff >= 0 && dateDiff <= 30) {
					const button = document.createElement('i')
					button.className = 'fa fa-link button-sxplus'
					button.title = 'Gå til note, som er oprettet inden for 30 minutter efter, at hændelsen blev registreret.'
					button.style.setProperty('color', '#f6e58d')
					button.addEventListener('click', () => {
						noteEntry.scrollIntoView({
							'behavior': 'smooth',
							'block': 'center',
						})

						noteEntry.classList.add('pulse')
						noteEntry.addEventListener('animationend', ({ animationName }) => {
							if (animationName === 'pulse') {
								noteEntry.classList.remove('pulse')
							}
						})
					})

					buttonCell.prepend(button)
				}
			}
		}

		const button = document.createElement('i')
		button.className = 'fa fa-file-text-o button-sxplus'
		button.title = 'Start en ny note, der indeholder det tidspunkt, hvor hændelsen blev registreret.'
		button.style.setProperty('color', '#ffffff')
		button.setAttribute('data-toggle', 'modal')
		button.setAttribute('data-target', '#modal-note')
		button.addEventListener('click', () => {
			noteTextEntry.value = `${type} ${punishmentTime}\n`
		})

		buttonCell.prepend(button)
	}
}

function createNotePunishmentEntires(punishments: HTMLTableRowElement[], notes: HTMLDivElement[]) {
	for (const noteEntry of notes) {
		const [noteHeadingElement, noteContentsElement] = noteEntry.children as HTMLCollectionOf<HTMLDivElement>
		if (noteHeadingElement === null || noteContentsElement === null) continue

		const noteHeading = noteHeadingElement.textContent
		if (noteHeading === null || noteHeading === 'Ingen noter') continue

		const noteContents = noteContentsElement.textContent
		if (noteContents === null) continue

		const [noteAuthor, noteTime] = noteHeading.split(',')

		const skipUser = skipNoteUsers.some((username) => noteAuthor.includes(username))
		if (skipUser) continue

		const noteDate = dayjs(noteTime, 'DD-MM-YY HH:mm:ss')

		for (const punishmentRow of punishments) {
			const punishmentTime = punishmentRow.children[0].textContent
			if (punishmentTime === null) continue

			const punishmentDate = dayjs(punishmentTime, 'DD-MM-YY HH:mm:ss')

			const dateDiff = punishmentDate.diff(noteDate, 'second')

			if (dateDiff < 0) {
				const timeString = noteDate.format('DD-MM-YY HH:mm:ss')

				const clone = punishmentRow.cloneNode(true) as HTMLTableRowElement
				clone.style.removeProperty('font-weight')
				clone.style.setProperty('color', '#2980b9')

				const [timeCell, typeCell, reasonCell, staffCell, dateCell, buttonCell] = clone.children as HTMLCollectionOf<HTMLTableCellElement>
				if (timeCell === null || typeCell === null || reasonCell === null || staffCell === null || dateCell === null || buttonCell === null) continue

				timeCell.textContent = timeString
				typeCell.textContent = 'Note'
				reasonCell.textContent = noteContents
				staffCell.textContent = noteAuthor
				dateCell.textContent = '-'

				while (buttonCell.lastElementChild) {
					buttonCell.removeChild(buttonCell.lastElementChild)
				}

				punishmentRow.insertAdjacentElement('beforebegin', clone)

				break
			}
		}
	}
}

export async function execute(): Promise<void> {
	setTimeout(() => {
		console.profile('punishmentNotes')

		const cont = document.querySelector('.template.template__controls')
		if (cont === null) return

		const punishments: HTMLTableRowElement[] | null = getLookupContainerFromHeaderText(
			'Strafhistorik',
			(element) => {
				const container = element.closest('.row')
				if (container === null) return

				const children = container.querySelectorAll<HTMLTableRowElement>('tbody > *')

				const punishments = Array.from(children)
				return punishments
			},
			null,
		)

		if (punishments === null) return

		const notes: HTMLDivElement[] | null = getLookupContainerFromHeaderText(
			'Noter',
			(element) => {
				const container = element.closest('.row')
				if (container === null) return

				const children = container.querySelectorAll<HTMLDivElement>('div.sp-widget__list > *')

				const notes = Array.from(children)
				return notes
			},
			null,
		)

		if (notes === null) return

		//Some fuckery was happening with the click event listeners when running the function immediately

		createNotesLink(punishments, notes)

		createNotePunishmentEntires(punishments, notes)

		console.profileEnd('punishmentNotes')
	})
}

execute()
