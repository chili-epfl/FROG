import React, { Component } from 'react';
WikiLink = () => {
  //observer(({ data, side }) => {
  // const pageObj = wikistore.pages[data.id];
  const spanEl = React.useRef(null);
  // const style = {
  //   textDecoration: 'underline',
  //   cursor: 'pointer',
  //   color: 'black'
  // };
  // if (!pageObj) {
  //   return <span style={style}>INVALID LINK</span>;
  // }
  // const pageTitle = pageObj.title;
  // const link = '/wiki/' + this.wikiId + '/' + pageTitle;

  const linkFn = e => {
    e.preventDefault();
    console.log(spanEl.current);
    window.e = spanEl.current;
    console.log(spanEl.current.closest('.reactRichText')?.dataset.wikiSide);
    const side = spanEl.current.closest('.reactRichText')?.dataset.wikiSide;
    console.log(e.shiftKey, side);
    const sideToSend =
      (side === 'left' && !e.shiftKey) || (side === 'right' && e.shiftKey)
        ? 'left'
        : 'right';
    // const push =
    //   sideToSend === 'left'
    //     ? this.props.history.push
    //     : this.props.history.push2;
    // push(link);
  };

  // const createLinkFn = e => {
  //   e.preventDefault();
  //   console.log(e.shiftKey, side);
  //   const sideToSend =
  //     (side === 'left' && !e.shiftKey) || (side === 'right' && e.shiftKey)
  //       ? 'left'
  //       : 'right';
  //   const push =
  //     sideToSend === 'left'
  //       ? this.props.history.push
  //       : this.props.history.push2;
  //   push(link);
  //   setTimeout(() => markPageAsCreated(this.wikiDoc, pageObj.id), 500);
  // };

  // if (!pageObj.created) {
  //   style.color = 'green';

  //   return (
  //     <span ref={spanEl} onClick={createLinkFn} style={style}>
  //       <b>{pageTitle}</b>
  //     </span>
  //   );
  // }

  // if (!pageObj.valid) {
  //   style.color = 'red';
  //   style.cursor = 'not-allowed';
  //   return <span style={style}>{pageTitle}</span>;
  // }

  // style.color = 'blue';

  return (
    <span ref={spanEl}>
      <b onClick={linkFn}>{'hi'}</b>
    </span>
  );
};
export default WikiLink;
