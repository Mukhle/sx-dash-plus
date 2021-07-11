import { getLookupContainerFromHeaderText } from './shared';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function createNotesLink(punishments: HTMLTableRowElement[], notes: HTMLDivElement[]) {
	const noteTextEntry = document.querySelector<HTMLTextAreaElement>('#notetext');
	if (noteTextEntry === null) return;

	for (const punishmentRow of punishments) {
		const type = punishmentRow.children[1].textContent;
		if (type === null) continue;

		const punishmentTime = punishmentRow.children[0].textContent;
		if (punishmentTime === null) continue;

		const punishmentDate = dayjs(punishmentTime, 'DD-MM-YY HH:mm:ss');

		const buttonCell = punishmentRow.children[5];
		if (buttonCell === null) continue;

		for (const noteEntry of notes) {
			const noteText = noteEntry.textContent?.toLowerCase();
			if (noteText === undefined) continue;

			if (noteText.includes(punishmentTime)) {
				const button = document.createElement('i');
				button.className = 'fa fa-link button-sxplus';
				button.title = 'Gå til note, som indeholder det tidspunkt, hvor hændelsen blev registreret.';
				button.style.setProperty('color', '#6ab04c');
				button.addEventListener('click', () => {
					noteEntry.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});

					noteEntry.classList.add('pulse');
					noteEntry.addEventListener('animationend', (event) => {
						if (event.animationName === 'pulse') {
							noteEntry.classList.remove('pulse');
						}
					});
				});

				buttonCell.prepend(button);
			} else {
				const noteTime = noteEntry.querySelector<HTMLDivElement>('.sp-widget__date')?.textContent?.substring(2);
				if (noteTime === undefined) continue;

				const noteUser = noteEntry.querySelector<HTMLDivElement>('.sp-widget__user')?.textContent;
				if (noteUser === null || noteUser === undefined) continue;

				const skipUser = ['CABPSH', 'ForumUnban', 'MASSUnban'].some((username) => noteUser.includes(username));
				if (skipUser) continue;

				const noteDate = dayjs(noteTime, 'DD-MM-YY HH:mm');
				const dateDiff = noteDate.diff(punishmentDate, 'minute');

				if (dateDiff >= 0 && dateDiff <= 30) {
					const button = document.createElement('i');
					button.className = 'fa fa-link button-sxplus';
					button.title = 'Gå til note, som er oprettet inden for 30 minutter efter, at hændelsen blev registreret.';
					button.style.setProperty('color', '#f6e58d');
					button.addEventListener('click', () => {
						noteEntry.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
						});

						noteEntry.classList.add('pulse');
						noteEntry.addEventListener('animationend', (event) => {
							if (event.animationName === 'pulse') {
								noteEntry.classList.remove('pulse');
							}
						});
					});

					buttonCell.prepend(button);
				}
			}
		}

		const button = document.createElement('i');
		button.className = 'fa fa-file-text-o button-sxplus';
		button.title = 'Start en ny note, der indeholder det tidspunkt, hvor hændelsen blev registreret.';
		button.setAttribute('data-toggle', 'modal');
		button.setAttribute('data-target', '#modal-note');
		button.style.setProperty('color', '#ffffff');
		button.addEventListener('click', () => {
			noteTextEntry.value = `${type} ${punishmentTime}\n`;
		});

		buttonCell.prepend(button);
	}
}

export const execute = async () => {
	setTimeout(() => {
		const cont = document.querySelector('.template.template__controls');
		if (cont === null) return;

		const punishments: HTMLTableRowElement[] | null = getLookupContainerFromHeaderText(
			'Strafhistorik',
			(element) => {
				const container = element.closest('.row');
				if (container === null) return;

				const children = container.querySelectorAll<HTMLTableRowElement>('tbody > *');

				const punishments = Array.from(children);
				return punishments;
			},
			null
		);

		if (punishments === null) return;

		const notes: HTMLDivElement[] | null = getLookupContainerFromHeaderText(
			'Noter',
			(element) => {
				const container = element.closest('.row');
				if (container === null) return;

				const children = container.querySelectorAll<HTMLDivElement>('div.sp-widget__list > *');

				const notes = Array.from(children);
				return notes;
			},
			null
		);

		if (notes === null) return;

		//Some fuckery was happening with the click event listeners when running the function immediately

		createNotesLink(punishments, notes);
	});
};

execute();
