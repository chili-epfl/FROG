import { uuid } from 'frog-utils';

const addNewWikiPage = (wikiDoc, liId, pageTitle, liType = 'li-richText') => {
  const pageId = uuid();
  const op = {
    p: ['pages', pageId],
    oi: {
      id: pageId,
      liId,
      valid: true,
      created: true,
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

export { addNewWikiPage, invalidateWikiPage, changeWikiPageTitle };
