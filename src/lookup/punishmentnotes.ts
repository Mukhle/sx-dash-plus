import { getLookupContainerFromHeaderText } from './shared';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const skip = ['Unban', 'Update'];
function createNotesLink(punishments: Element[], notes: Element[]) {
	for (const punishmentRow of punishments) {
		const type = punishmentRow.children[1].textContent;
		if (type === null) continue;

		if (skip.includes(type)) continue;

		const punishmentTime = punishmentRow.children[0].textContent;
		if (punishmentTime === null) continue;

		const buttonCell = punishmentRow.children[2];
		if (buttonCell === null) continue;

		const punishmentDate = dayjs(punishmentTime, 'DD-MM-YY HH:mm:ss');

		for (const noteEntry of notes) {
			const noteText = noteEntry.textContent?.toLowerCase();
			if (noteText === undefined) continue;

			if (noteText) {
				if (noteText.includes(punishmentTime)) {
					const button = document.createElement('i');
					button.className = 'fa fa-file-text-o';
					button.title = 'Note indeholder tidspunktet hvor straffen er registreret';
					button.style.setProperty('cursor', 'pointer');
					button.style.setProperty('color', '#6ab04c');
					button.style.setProperty('margin-left', '4px');
					button.addEventListener('click', () => {
						noteEntry.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
						});
					});

					buttonCell.appendChild(button);
				} else {
					const noteTime = noteEntry.querySelector<HTMLDivElement>('.sp-widget__date')?.textContent?.substring(2);
					if (noteTime === undefined) continue;

					const noteUser = noteEntry.querySelector<HTMLDivElement>('.sp-widget__user')?.textContent;
					if (noteUser === null || noteUser === undefined) continue;

					const skipUser = ['CABPSH', 'ForumUnban', 'MASSUnban'].some((username) => {
						if (noteUser.includes(username)) return true;
					});
					if (skipUser) continue;

					const noteDate = dayjs(noteTime, 'DD-MM-YY HH:mm');
					const dateDiff = noteDate.diff(punishmentDate, 'minute');

					if (dateDiff >= 0 && dateDiff <= 30) {
						const button = document.createElement('i');
						button.className = 'fa fa-file-text-o';
						button.title = 'Note oprettet inden for 30 efter straffen er registreret';
						button.style.setProperty('cursor', 'pointer');
						button.style.setProperty('color', '#f6e58d');
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
