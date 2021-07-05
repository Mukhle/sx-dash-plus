export const execute = async () => {
	const mainHeading = document.querySelector(".main-heading");

	if (mainHeading?.childElementCount == 0) {
		mainHeading.remove();
	}
};

execute();
