// @flow

import { values } from 'frog-utils';
import { toJS } from 'mobx';

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

const getPageTitle = (
  pages: Object,
  statePageTitle: ?string,
  deletedPageId: ?string
) => {
  if (statePageTitle && !deletedPageId) return statePageTitle;

  if (Object.keys(pages).length > 0) {
    // eslint-disable-next-line guard-for-in
    for (const pageTitle in pages) {
      const pageObj = pages[pageTitle.toLowerCase()];
      if (pageObj.valid && pageObj.id !== deletedPageId) return pageObj.title;
    }
  }

  return null;
};

const checkNewPageTitle = (parsedPages, newPageTitle) => {
  const parsedTitle = newPageTitle.toLowerCase().trim();
  if (parsedTitle === '') return 'Title cannot be empty';
  if (parsedTitle.includes('/')) return 'Title cannot contain /';
  if (parsedPages[parsedTitle]?.valid) return 'Title already used';

  return null;
};

const getDifferentPageId = (pages, oldPageId) => {
  for (const page of pages) {
    if (page.id !== oldPageId) return page.id;
  }

  return null;
};

const getPageDetailsForLiId = (wikiPages, liId) => {
  for (const pageObj of values(toJS(wikiPages))) {
    const pageId = pageObj.id;
    if (pageObj.plane === 3 && pageObj.liId === liId) {
      return {
        pageId
      };
    } else if (pageObj.plane === 1) {
      for (const instanceObj of values(pageObj.instances)) {
        const instanceId = instanceObj.instanceId;
        if (instanceObj.liId === liId)
          return {
            pageId,
            instanceId
          };
      }
    }
  }

  return {};
};

export {
  parseDocResults,
  parseSearch,
  getPageTitle,
  checkNewPageTitle,
  getDifferentPageId,
  getPageDetailsForLiId
};
