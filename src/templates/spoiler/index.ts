import "./index.scss";

document.querySelectorAll<HTMLElement>(".spoiler").forEach((container) => {
	const overlay = container.querySelector(".spoiler-overlay");

	overlay?.addEventListener("click", () => {
		container.dataset.open = "";
	});
});
