chrome.runtime.onMessage.addListener((request) => {
	if (request.action === 'addContextMenu') {
		chrome.contextMenus.removeAll(() => {
			for (const steamid of request.steamids) {
				chrome.contextMenus.create({
					title: `Søg på Dash efter "${steamid}"`,
					contexts: ['selection'],
					onclick: () => {
						chrome.tabs.create({ url: `https://stavox.dk/dash/lookup?lookupid=${steamid}` });
					},
				});
			}
		});
	} else if (request.action === 'removeContextMenu') {
		chrome.contextMenus.removeAll();
	}
});
