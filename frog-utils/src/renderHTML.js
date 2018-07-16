// @flow

import * as React from 'react';
import { renderToString } from 'katex';
import { withState } from 'recompose';
import { uuid } from 'frog-utils';

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
  setUpdate
}: {
  html: string,
  setUpdate: string => void
}) => {
  if (typeof html !== 'string') {
    return null;
  }
  let toRender;
  try {
    toRender = html.replace(/\$(.*?)\$/gi, hit => {
      const a = hit.slice(1, hit.length - 1);
      return renderToString(a);
    });
    toRender = toRender.replace(/\[\[(.*?)\]\]/gi, hit => {
      const a = hit.slice(2, hit.length - 2);
      if (Cache[a]) {
        return Cache[a];
      } else {
        window.setTimeout(getCache(a, setUpdate), 0);
        return '...';
      }
    });
  } catch (e) {
    console.warn(e);
    toRender = html;
  }

  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: toRender }} />;
};

export default withState('update', 'setUpdate', '')(HTML);
