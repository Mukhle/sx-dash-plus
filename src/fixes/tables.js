const unbind_event_listeners = (node) => {
	var parent = node.parentNode;
	if (parent) {
		parent.replaceChild(node.cloneNode(true), node);
	} else {
		var ex = new Error(
			"Cannot remove event listeners from detached or document nodes"
		);
		ex.code = DOMException[(ex.name = "HIERARCHY_REQUEST_ERR")];
		throw ex;
	}
};

for (const element of document.querySelectorAll("tr")) {
	const onclick = element.getAttribute("onclick");

	if (onclick?.includes("lookup")) {
		element.removeAttribute("onclick");
		unbind_event_listeners(element);
	}

	element.classList.add("sxplustr")

	console.log(element.classList)
}
