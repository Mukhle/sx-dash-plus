const unbind_event_listeners = (node) => {
	node.parentNode?.replaceChild(node.cloneNode(true), node);
};

function removeTableRowListeners(root) {
	for (const element of root.querySelectorAll(".table>tbody>tr")) {
		element.classList.add("sxplusrow");
		element.removeAttribute("onclick");
		unbind_event_listeners(element);
	}
}

removeTableRowListeners(document);
