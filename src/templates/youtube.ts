// This could be replaced with https://www.mediawiki.org/wiki/Extension:YouTube, but it
// was easier to just implement it myself instead of asking & waiting for it to be added.

[...document.querySelectorAll<HTMLElement>(".youtube")].map((element) => {
  const { videoId, ...attributes } = element.dataset;

  const iframe = document.createElement("iframe");

  iframe.setAttribute("width", String(560));
  iframe.setAttribute("height", String(315));
  iframe.setAttribute("frameborder", String(0));
  // As suggested by YouTube's embed copy.
  iframe.setAttribute(
    "allow",
    [
      "accelerometer",
      "autoplay",
      "clipboard-write",
      "encrypted-media",
      "gyroscope",
      "picture-in-picture",
      "web-share"
    ].join("; ")
  );
  iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  iframe.setAttribute("allowfullscreen", String(true));

  // Set the attributes from the data-* attributes, overwriting the default ones.
  Object.entries(attributes).map(([key, value]) =>
    value && iframe.setAttribute(key, value)
  );

  iframe.setAttribute("style", element.getAttribute("style") || "");
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;

  element.replaceWith(iframe);
});
