export function isWhitelistedPage(pages: Array<string>): boolean {
  const [pageName, pageLanguage] = mw.config.get("wgPageName").split("/");

  if (!pageName || !pages.includes(pageName)) return false;
  if (pageLanguage && mw.config.get("wgPageContentLanguage") != pageLanguage) return false;

  return true;
}