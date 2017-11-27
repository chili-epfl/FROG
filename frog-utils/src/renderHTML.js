// @flow

import React from 'react';
import { renderToString } from 'katex';

export default ({ html }: { html: string }) => {
  let toRender;
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

  return <div dangerouslySetInnerHTML={{ __html: toRender }} />;
};
