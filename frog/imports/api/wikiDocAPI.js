const addNewWikiPage = (wikiDoc, pageId, pageTitle) => {
  const op = {
    p: ['pages', pageId],
    oi: {
      valid: true,
      created: true,
      title: pageTitle
    }
  }
  
  wikiDoc.submitOp(op);
}

const invalidateWikiPage = (wikiDoc, pageId) => {
  const op = {
    p: ['pages', pageId, 'valid'],
    od: true,
    oi: false,
  }
  
  wikiDoc.submitOp(op);
}

const changeWikiPageTitle = (wikiDoc, pageId, oldPageTitle, newPageTitle) => {
  const op = {
    p: ['pages', pageId, 'title'],
    od: oldPageTitle,
    oi: newPageTitle,
  }
  
  wikiDoc.submitOp(op);
}

export { addNewWikiPage, invalidateWikiPage, changeWikiPageTitle };