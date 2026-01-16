const portletId = "p-userpagetools";

function lowercaseFirst(value: string): string {
	return value.charAt(0).toLowerCase() + value.slice(1);
}

if (mw.util.isPortletVisible(portletId)) {
	const userId = lowercaseFirst(mw.config.get("wgPageName").split(":")[1]!);

	mw.util.addPortletLink(portletId, `https://vrchat.com/home/user/${userId}`, "VRChat profile");

	if (mw.config.get("wgUserGroups")?.includes("community-mod"))
		mw.util
			.addPortletLink(portletId, `vrcx://user/${userId}`, "VRCX profile")!
			.querySelector("a")!
			.classList
			.add("external");
}
