import { getLookupContainerFromHeaderText } from './shared';

function createNotesLink(punishments: Element[], notes: Element[]) {
	for (const punishmentRow of punishments) {
		const time = punishmentRow.children[0].textContent;
		if (time === null) continue;

		const buttonCell = punishmentRow.children[0];
		if (buttonCell === null) continue;

		for (const noteEntry of notes) {
			const noteText = noteEntry.textContent?.toLowerCase();
			if (noteText === undefined) continue;

			if (noteText && noteText.includes(time)) {
				console.log(punishmentRow, noteEntry);

				const button = document.createElement('i');
				button.className = 'fa fa-file-text-o';
				button.style.setProperty('cursor', 'pointer');
				button.style.setProperty('color', '#ffffff');
				button.style.setProperty('margin-left', '4px');
				button.addEventListener('click', () => {
					noteEntry.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
					});
				});

				buttonCell.appendChild(button);
			}
		}
	}
}

export const execute = async () => {
	const cont = document.querySelector('body > div > div > div.main > div > div.container-fluid.half-padding > div');
	if (cont === null) return;

	const [punishments, punishmentsRow]: [HTMLElement[] | null, HTMLElement | null] = getLookupContainerFromHeaderText(
		'Strafhistorik',
		(element) => {
			const punishmentsRow = element.closest('.row');
			const punishments = punishmentsRow?.querySelector('tbody')?.children;

			if (punishments === undefined) return;

			return [punishments, punishmentsRow];
		},
		[null, null]
	);

	if (punishments === null || punishmentsRow === null) return;

	const notes: HTMLElement[] | null = getLookupContainerFromHeaderText(
		'Noter',
		(element) => {
			const notes = element.closest('.row')?.querySelector<HTMLElement>('div.sp-widget__list')?.children;

			if (notes === undefined) return;

			return notes;
		},
		null
	);

	if (notes === null) return;

	setTimeout(() => {
		createNotesLink(punishments, notes);
	});
};

execute();
