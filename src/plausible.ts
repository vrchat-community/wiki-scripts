var script = document.createElement("script");

script.setAttribute("defer", "defer");
script.setAttribute("data-domain", "wiki.vrchat.com");

script.setAttribute("event-page-name", mw.config.get("wgTitle"));
script.setAttribute("event-page-language", mw.config.get("wgPageContentLanguage"));

const namespaces = mw.config.get("wgFormattedNamespaces");
script.setAttribute("event-page-namespace", namespaces[mw.config.get("wgNamespaceNumber")!]!);

script.setAttribute("event-theme", mw.config.get("skin"));
script.setAttribute("event-action", mw.config.get("wgAction"));

script.setAttribute("event-is-logged-in", String(mw.config.get("wgUserName") !== null));

const wgUserGroups = mw.config.get("wgUserGroups")!;

const maintainer = wgUserGroups.includes("community-mod")
  || wgUserGroups.includes("moderator")
  || wgUserGroups.includes("sysop")

script.setAttribute("event-is-maintainer", String(maintainer));

script.src = "https://plausible.io/js/script.pageview-props.outbound-links.js";
document.head.appendChild(script);
