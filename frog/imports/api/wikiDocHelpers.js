// @flow
import { uuid } from '/imports/frog-utils';
import { type WikiSettingsT } from '/imports/client/Wiki/types';

export const addNewWikiPage = (
  wikiDoc: Object,
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
  wikiDoc: Object,
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

export const invalidateWikiPage = (wikiDoc: Object, pageId, cb) => {
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

export const changeWikiPageTitle = (wikiDoc: Object, pageId, newPageTitle) => {
  const op = {
    p: ['pages', pageId, 'title'],
    od: null,
    oi: newPageTitle
  };

  wikiDoc.submitOp(op);
};

export const markPageAsCreated = (wikiDoc: Object, pageId) => {
  const op = {
    p: ['pages', pageId, 'created'],
    od: false,
    oi: true
  };

  wikiDoc.submitOp(op);
};

export const restoreWikiPage = (wikiDoc: Object, pageId, cb) => {
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

export const changeWikiPageLI = (wikiDoc: Object, pageId, newLiId) => {
  const op = {
    p: ['pages', pageId, 'liId'],
    od: null,
    oi: newLiId
  };

  wikiDoc.submitOp(op);
};

export const createNewEmptyWikiDoc = (wikiDoc: Object, wikiId, liId, owner) => {
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

export const completelyDeleteWikiPage = (wikiDoc: Object, pageId) => {
  const op = {
    p: ['pages', pageId],
    od: null
  };

  wikiDoc.submitOp(op);
};

// Adds the userid to the list of users in the wiki
export const addUser = (wikiDoc: Object, userid: string) => {
  const op = {
    p: ['users', 0],
    li: userid
  };
  wikiDoc.submitOp(op);
};

// Adds the userid to the list of editors in the wiki
export const addEditor = (wikiDoc: Object, userid: string) => {
  const op = {
    p: ['editors', 0],
    li: userid
  };
  wikiDoc.submitOp(op);
};

function invalidateUsers(wikiDoc: Object) {
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

export const updateSettings = (wikiDoc: Object, settings: WikiSettingsT) => {
  const op = {
    p: ['settings'],
    oi: settings
  };
  wikiDoc.submitOp(op);
  if (wikiDoc.data.password !== settings.password) {
    invalidateUsers(wikiDoc);
  }
};
