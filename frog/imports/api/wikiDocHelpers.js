import { uuid } from 'frog-utils';

export const addNewWikiPage = (
  wikiDoc,
  pageTitle,
  setCreated,
  liType = 'li-richText',
  plane,
  instances = {},
  socialStructure,
  noNewInstances
) => {
  const pageId = uuid();
  const obj = {
    id: pageId,
    valid: true,
    created: setCreated || false,
    title: pageTitle,
    liType,
    plane,
    instances,
    noNewInstances
  };
  if (socialStructure) {
    obj.socialStructure = socialStructure;
  }

  const op = {
    p: ['pages', pageId],
    oi: obj
  };

  wikiDoc.submitOp(op);
  return pageId;
};

export const addNewGlobalWikiPage = (
  wikiDoc,
  pageTitle,
  liId,
  setCreated,
  liType = 'li-richText'
) => {
  const pageId = uuid();
  const obj = {
    id: pageId,
    plane: 3,
    title: pageTitle,
    valid: true,
    created: setCreated || false,
    liId,
    liType
  };

  const op = {
    p: ['pages', pageId],
    oi: obj
  };

  wikiDoc.submitOp(op);
  return pageId;
};

export const addNewWikiPageWithInstances = (
  wikiDoc,
  plane,
  pageTitle,
  liType,
  instanceId,
  instanceName,
  liId
) => {
  const pageId = uuid();

  const instancesObj = {};
  instancesObj[instanceId] = {
    instanceId,
    instanceName,
    liId
  };

  const obj = {
    id: pageId,
    plane,
    title: pageTitle,
    valid: true,
    created: true,
    liType,
    instances: instancesObj
  };

  const op = {
    p: ['pages', pageId],
    oi: obj
  };

  wikiDoc.submitOp(op);
  return pageId;
};

export const addNewInstancePage = (
  wikiDoc,
  pageId,
  instanceId,
  instanceName,
  liId
) => {
  const instanceObj = {
    instanceId,
    instanceName,
    liId
  };

  const op = {
    p: ['pages', pageId, 'instances', instanceId],
    oi: instanceObj
  };

  wikiDoc.submitOp(op);
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

export const changeWikiPageTitle = (wikiDoc, pageId, newPageTitle) => {
  const op = {
    p: ['pages', pageId, 'title'],
    od: null,
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

export const restoreWikiPage = (wikiDoc, pageId, cb) => {
  const op = {
    p: ['pages', pageId, 'valid'],
    od: false,
    oi: true
  };

  wikiDoc.submitOp(op);
  if (cb) {
    cb();
  }
};

export const changeWikiPageLI = (wikiDoc, pageId, newLiId) => {
  const op = {
    p: ['pages', pageId, 'liId'],
    od: null,
    oi: newLiId
  };

  wikiDoc.submitOp(op);
};

export const createNewEmptyWikiDoc = (wikiDoc, wikiId, liId) => {
  const emptyDocValues = {
    wikiId,
    pages: {
      home: {
        id: 'home',
        valid: true,
        created: true,
        title: 'Home',
        liId,
        liType: 'li-richText',
        instances: {},
        plane: 3
      }
    }
  };
  wikiDoc.create(emptyDocValues);
};

export const completelyDeleteWikiPage = (wikiDoc, pageId) => {
  const op = {
    p: ['pages', pageId],
    od: null
  };

  wikiDoc.submitOp(op);
};
