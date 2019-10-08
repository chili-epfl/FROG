// @flow

import * as React from 'react';
import { withRouter } from 'react-router';
import { toObject as queryToObject } from 'query-parse';
import Wiki from './index';
import { type PageObjT } from '/imports/api/wikiTypes';
import { sanitizeTitle } from './helpers';

type PropsT = {
  location: *,
  match: {
    params: PageObjT
  },
  history: Object,
  embed: boolean
};

// Redirects user to home if they don't specify a page and decodes the page title from the uri
const decodePageTitle = (currentTitle: string): string => {
  if (decodeURIComponent(currentTitle) === 'undefined') {
    return 'Home';
  }
  const sanitizedCurrentTitle = sanitizeTitle(currentTitle);
  return decodeURIComponent(sanitizedCurrentTitle);
};

/**
 * Wraps the wiki for the router and handles URL changes
 */
function WikiWrapper(props: PropsT) {
  const { wikiId, pageTitle, instance } = props.match.params;
  return (
    <Wiki
      pageObj={{
        wikiId,
        // What should be the behaviour when pageTitle is undefined?
        // $FlowFixMe
        pageTitle: decodePageTitle(pageTitle),
        instance
      }}
      // Function to navigate to a page
      setPage={(pageObj: PageObjT, replace?: boolean) => {
        // What should be the behaviour when pageTitle is undefined?
        // $FlowFixMe
        const encodedTitle = encodeURIComponent(pageObj.pageTitle);
        if (pageObj.instance) {
          if (replace) {
            props.history.replace(
              `/wiki/${pageObj.wikiId}/${encodedTitle}/${pageObj.instance}`
            );
          } else {
            props.history.push(
              `/wiki/${pageObj.wikiId}/${encodedTitle}/${pageObj.instance}`
            );
          }
        } else if (pageObj.pageTitle) {
          if (replace) {
            props.history.replace(`/wiki/${pageObj.wikiId}/${encodedTitle}`);
          } else {
            props.history.push(`/wiki/${pageObj.wikiId}/${encodedTitle}`);
          }
        } else if (pageObj.wikiId) {
          if (replace) {
            props.history.replace(`/wiki/${pageObj.wikiId}`);
          } else {
            props.history.push(`/wiki/${pageObj.wikiId}`);
          }
        }
      }}
      query={queryToObject(props.location.search.slice(1))}
    />
  );
}

export default withRouter(WikiWrapper);
