const steamidPattern = /STEAM_\d:\d:\d+/g
const blacklistedLookup = ['STEAM_0:1:48016748', 'STEAM_0:0:56939043']

let selectionChanged = false
document.addEventListener('selectionchange', () => {
	selectionChanged = true
})

document.addEventListener('mouseup', () => {
	if (selectionChanged === false) return

	const steamids = (() => {
		const selection = document.getSelection()
		if (selection === null) return

		const selectionText = selection.toString()
		if (selectionText === '') return

		const match = selectionText.match(steamidPattern)
		if (match === null) return

		const steamids: string[] = []
		for (const steamid of match) {
			if (blacklistedLookup.includes(steamid)) continue

			steamids.push(steamid)
		}

		return steamids
	})()

	if (steamids) {
		chrome.runtime.sendMessage({ 'action': 'addContextMenu', 'steamids': steamids })
	} else {
		chrome.runtime.sendMessage({ 'action': 'removeContextMenu' })
	}

	selectionChanged = false
})
