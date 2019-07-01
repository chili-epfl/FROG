// @flow

import * as React from 'react';
import { renderToString } from 'katex';
import { withState } from 'recompose';
import clip from 'text-clipper';
import { uuid, getEmbedlyCache, EmbedlyCache } from './index';

const HTML = ({
  html,
  setUpdate,
  shorten
}: {
  html: string,
  setUpdate: string => void,
  shorten: number
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
      if (EmbedlyCache[a]) {
        return EmbedlyCache[a];
      } else {
        window.setTimeout(
          () => getEmbedlyCache(a).then(() => setUpdate(uuid())),
          0
        );
        return '...';
      }
    });
  } catch (e) {
    console.warn(e);
    toRender = html;
  }
  if (shorten) {
    toRender = clip(toRender, shorten, { html: true });
  }

  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: toRender }} />;
};

const DefaultExport: React.ComponentType<*> = withState(
  'update',
  'setUpdate',
  ''
)(HTML);

export default DefaultExport;
