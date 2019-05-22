WikiLink = observer(({ data }) => {
  const pageObj = wikistore.pages[data.id];
  const style = {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: 'black'
  };
  if (!pageObj) {
    return <span style={style}>INVALID LINK</span>;
  }
  const pageTitle = pageObj.title;
  const link =
    '/wiki/' +
    this.wikiId +
    '/' +
    pageTitle +
    (data.instance ? '/' + data.instance : '');

  const linkFn = e => {
    e.preventDefault();
    this.props.history.push(link);
  };

  const createLinkFn = e => {
    e.preventDefault();
    const linkWithEdit = link + '?edit=true';
    this.props.history.push(linkWithEdit);
    setTimeout(() => markPageAsCreated(this.wikiDoc, pageObj.id), 500);
  };
  const displayTitle = pageTitle + (data.instance ? '/' + data.instance : '');

  if (!pageObj.created) {
    style.color = 'green';

    return (
      <span onClick={createLinkFn} style={style}>
        <b>{displayTitle}</b>
      </span>
    );
  }

  const deletedPageLinkFn = e => {
    e.preventDefault();
    this.setState({
      deletedPageModalOpen: true,
      currentDeletedPageId: pageObj.id,
      currentDeletedPageTitle: pageObj.title
    });
  };
  if (!pageObj.valid) {
    style.color = 'red';
    style.cursor = 'not-allowed';
    return (
      <span onClick={deletedPageLinkFn} style={style}>
        {pageTitle}
      </span>
    );
  }

  style.color = 'blue';

  return (
    <span onClick={linkFn} style={style}>
      <b>{displayTitle}</b>
    </span>
  );
});
