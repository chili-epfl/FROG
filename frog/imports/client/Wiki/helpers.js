// @flow

import { values } from 'frog-utils';
import { Meteor } from 'meteor/meteor';
import { toJS } from 'mobx';
import { findKey } from 'lodash'

const getInstanceId = page => {
  if (!page) {
    return 'all';
  }
  const userId = Meteor.userId();
  if (page.plane === 1) {
    return userId;
  }

  if (page.plane === 2) {
    const group = findKey(page.socialStructure, x => x.includes(userId));
    return group || 'Other group';
  }
  return 'all';
};

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

const parsePageObjForReactiveRichText = (
  wikiId: string,
  pageObj: Object,
  alsoInstances: boolean
) => {
  const template = {
    wikiId,
    id: pageObj.id,
    title: pageObj.title,
    liId: pageObj.liId || pageObj.instances[getInstanceId(pageObj)]?.liId,
    created: pageObj.created,
    valid: pageObj.valid
  };

  if (!pageObj.plane || pageObj.plane === 3 || !alsoInstances) {
    return template;
  }
  if (pageObj.plane === 1) {
    return [
      template,
      ...Object.keys(pageObj.instances).map(x => ({
        ...template,
        title: pageObj.title + '/' + pageObj.instances[x].username,
        instance: pageObj.instances[x].username,
        liId: toJS(pageObj.instances[x].liId)
      }))
    ];
  }
  return [
    template,
    ...Object.keys(pageObj.instances).map(x => ({
      ...template,
      title: pageObj.title + '/' + x,
      instance: x,
      liId: toJS(pageObj.instances[x].liId)
    }))
  ];
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

export {
  parseDocResults,
  parseSearch,
  parsePageObjForReactiveRichText,
  getPageTitle
};
