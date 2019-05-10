import { uuid } from 'frog-utils';

export const addNewWikiPage = (
  wikiDoc,
  pageTitle,
  setCreated,
  liType = 'li-richText',
  plane
) => {
  const pageId = uuid();
  const obj = {
    id: pageId,
    valid: true,
    created: setCreated || false,
    title: pageTitle,
    liType,
    plane,
    instances: {}
  };

  const op = {
    p: ['pages', pageId],
    oi: obj
  };

  wikiDoc.submitOp(op);
  return pageId;
};

export const invalidateWikiPage = (wikiDoc, pageId, cb) => {
  const op = {
    p: ['pages', pageId, 'valid'],
    od: true,
    oi: false
  };

  wikiDoc.submitOp(op);
  if (cb) {
    cb();
  }
};

export const changeWikiPageTitle = (
  wikiDoc,
  pageId,
  oldPageTitle,
  newPageTitle
) => {
  const op = {
    p: ['pages', pageId, 'title'],
    od: oldPageTitle,
    oi: newPageTitle
  };

  wikiDoc.submitOp(op);
};

export const markPageAsCreated = (wikiDoc, pageId) => {
  const op = {
    p: ['pages', pageId, 'created'],
    od: false,
    oi: true
  };

  wikiDoc.submitOp(op);
};

export const addInstance = (wikiDoc, pageId, instanceId, liId) => {
  const op = {
    p: ['pages', pageId, 'instances', instanceId],
    oi: liId
  };

  wikiDoc.submitOp(op);
};
