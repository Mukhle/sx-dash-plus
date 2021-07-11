export const execute = async () => {
	const panel = document.querySelector('.panel.panel-danger');

	if (panel) {
		const colDiv = document.createElement('div');
		colDiv.className = 'col-md-12 col-xs-11';

		panel.parentNode?.insertBefore(colDiv, panel);
		colDiv.appendChild(panel);
	}
};

execute();
