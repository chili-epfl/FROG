const addNewWikiPage = (
  wikiDoc,
  pageId,
  pageTitle,
  liType = 'li-richText',
  cb
) => {
  const op = {
    p: ['pages', pageId],
    oi: {
      id: pageId,
      valid: true,
      created: true,
      title: pageTitle,
      liType
    }
  };

  wikiDoc.submitOp(op);
  if (cb) {
    cb();
  }
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
