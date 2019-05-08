import { uuid } from 'frog-utils';

const addNewWikiPage = (wikiDoc, liId, pageTitle, setCreated, liType = 'li-richText') => {
  const pageId = uuid();
  const op = {
    p: ['pages', pageId],
    oi: {
      id: pageId,
      liId,
      valid: true,
      created: setCreated || false,
      title: pageTitle,
      liType
    }
  };

  wikiDoc.submitOp(op);
  return pageId;
};

const invalidateWikiPage = (wikiDoc, pageId, cb) => {
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

const changeWikiPageTitle = (wikiDoc, pageId, oldPageTitle, newPageTitle) => {
  const op = {
    p: ['pages', pageId, 'title'],
    od: oldPageTitle,
    oi: newPageTitle
  };

  wikiDoc.submitOp(op);
};

const markPageAsCreated = (wikiDoc, pageId) => {
  const op = {
    p: ['pages', pageId, 'created'],
    od: false,
    oi: true
  };

  wikiDoc.submitOp(op);
}

export { addNewWikiPage, invalidateWikiPage, changeWikiPageTitle, markPageAsCreated };
