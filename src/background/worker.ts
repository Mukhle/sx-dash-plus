chrome.runtime.onMessage.addListener((request) => {
	if (request.action === 'addContextMenu') {
		chrome.contextMenus.removeAll(() => {
			const existing: {
				[key: string]: boolean
			} = {}

			for (const steamid of request.steamids) {
				if (existing[steamid]) continue

				const contextItemID = chrome.contextMenus.create({
					'id': steamid,
					'title': `Søg på Dash efter "${steamid}"`,
					'contexts': ['selection'],
				})

				if (contextItemID === undefined) continue

				existing[steamid] = true
			}
		})
	} else if (request.action === 'removeContextMenu') {
		chrome.contextMenus.removeAll()
	}
})

chrome.contextMenus.onClicked.addListener((data) => {
	chrome.tabs.create({ 'url': `https://stavox.dk/dash/lookup?lookupid=${data.menuItemId}` })
})
