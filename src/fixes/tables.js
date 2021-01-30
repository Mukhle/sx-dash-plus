const unbind_event_listeners = (node) => {
	node.parentNode?.replaceChild(node.cloneNode(true), node);
};

for (const element of document.querySelectorAll("tr[onclick]")) {
	element.removeAttribute("onclick");
	unbind_event_listeners(element);
}
