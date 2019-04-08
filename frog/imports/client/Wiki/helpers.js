// @flow

const parseDocResults = function(results) {
  const pagesData = results.pages;
  const pages = {};

  // eslint-disable-next-line guard-for-in
  for (const pageId in pagesData) {
    const pageObj = pagesData[pageId];
    pages[pageObj.title] = pageObj;
  }

  return pages;
}

const parseSearch = function(search) {
  if (search === '') return {};

  const cleanedSearch = decodeURI(search.substring(1));
  const parameters = cleanedSearch.split('&');
  const attributes = {}
  for (let param of parameters) {
    param = param.split('=');
    attributes[param[0]] = param[1];
  }

  return attributes;
}

export { parseDocResults, parseSearch }