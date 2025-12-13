import "./spoiler.css";

[...document.querySelectorAll<HTMLElement>(".spoiler")].map((container) => {
  const overlay = container.querySelector(".spoiler-overlay");

  overlay?.addEventListener("click", () => {
    container.dataset.open = "";
  });
});