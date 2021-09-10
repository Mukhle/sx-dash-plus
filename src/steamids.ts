import { userIsStaff, processTextNodes } from './lookup/shared'

export async function execute(): Promise<void> {
	if (userIsStaff) {
		processTextNodes(document.body)
	}
}

execute()
