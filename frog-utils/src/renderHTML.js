// @flow

import React from 'react';
import { renderToString } from 'katex';
import { withState } from 'recompose';
import { uuid } from 'lodash';

const Cache = {};

const getCache = (item: string, setUpdate) => {
  fetch('//noembed.com/embed?url=' + item.replace(/(<([^>]+)>)/gi, ''))
    .then(x => x.json())
    .then(x => {
      Cache[item] = x.html;
      setUpdate(uuid());
    });
};

const HTML = ({
  html,
  update,
  setUpdate
}: {
  html: string,
  update: string,
  setUpdate: string => void
}) => {
  let toRender;
  if (html.startsWith('http')) {
    if (Cache[html]) {
      toRender = Cache[html];
    } else {
      window.setTimeout(getCache(html, setUpdate), 0);
      toRender = '...';
    }
  } else {
    try {
      toRender = html.replace(/\$\$(.*?)\$\$/gi, hit => {
        const a = hit.slice(2, hit.length - 2);
        return renderToString(a);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toRender = html;
    }
  }

  return <div dangerouslySetInnerHTML={{ __html: toRender }} />;
};

export default withState('update', 'setUpdate', '')(HTML);
