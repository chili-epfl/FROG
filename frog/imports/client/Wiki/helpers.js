// @flow

const parseDocResults = function(results) {
  const pages = {};
  for (let doc of results) {
    const pageTitle = doc.data.title;
    pages[pageTitle] = {
      id: doc.id,
      title: pageTitle,
    }
  }

  return pages;
}

const parseSearch = function(search, learningItems) {
  if (search === '') return null;

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