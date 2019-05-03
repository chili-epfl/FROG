// @flow

const parseDocResults = function(results: Object) {
  const pagesData = results.pages;
  const pages = {};

  // eslint-disable-next-line guard-for-in
  for (const pageId in pagesData) {
    const pageObj = pagesData[pageId];
    pages[pageObj.title.toLowerCase()] = pageObj;
  }

  return pages;
};

const parseSearch = function(search: string) {
  if (search === '') return {};

  const cleanedSearch = decodeURI(search.substring(1));
  const parameters = cleanedSearch.split('&');
  const attributes = {};
  for (let param of parameters) {
    param = param.split('=');
    attributes[param[0]] = param[1];
  }

  return attributes;
};

const parsePageObjForReactiveRichText = (wikiId: string, pageObj: Object) => ({
  wikiId,
  id: pageObj.id,
  liId: pageObj.id,
  title: pageObj.title,
  created: pageObj.created,
  valid: pageObj.valid
});

const getPageTitle = (
  pages: Object,
  statePageTitle: ?string,
  deletedPageId: ?string
) => {
  if (
    statePageTitle &&
    pages[statePageTitle.toLowerCase()] &&
    pages[statePageTitle.toLowerCase()].valid
  )
    return statePageTitle;

  if (Object.keys(pages).length > 0) {
    // eslint-disable-next-line guard-for-in
    for (const pageTitle in pages) {
      const pageObj = pages[pageTitle.toLowerCase()];
      if (pageObj.valid && pageObj.id !== deletedPageId) return pageObj.title;
    }
  }

  return null;
};

export {
  parseDocResults,
  parseSearch,
  parsePageObjForReactiveRichText,
  getPageTitle
};
