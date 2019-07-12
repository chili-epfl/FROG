import { uuid } from 'frog-utils';

export const addNewWikiPage = (
  wikiDoc,
  title,
  setCreated,
  liType = 'li-richText',
  liId,
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
    title,
    liId,
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

export const createNewEmptyWikiDoc = (wikiDoc, wikiId, liId, owner) => {
  const emptyDocValues = {
    wikiId,
    owners: Array.of(owner),
    users: Array.of(owner),
    editors: Array.of(owner),
    settings: {
      password: '',
      restrict: 'none',
      allowPageCreation: true,
      locked: false
    },
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

export const addUser = (wikiDoc, userid) => {
  const op = {
    p: ['users', 0],
    li: userid
  };
  wikiDoc.submitOp(op);
};

export const addEditor = (wikiDoc, userid) => {
  const op = {
    p: ['editors', 0],
    li: userid
  };
  wikiDoc.submitOp(op);
};

export const updateSettings = (wikiDoc, settings) => {
  const op = {
    p: ['settings'],
    oi: settings
  };
  wikiDoc.submitOp(op);
  if (wikiDoc.data.password !== settings.password) {
    const opDropEditors = {
      p: ['editors'],
      oi: []
    };
    wikiDoc.submitOp(opDropEditors);
    const opDropUsers = {
      p: ['users'],
      oi: []
    };
    wikiDoc.submitOp(opDropUsers);
  }
};
