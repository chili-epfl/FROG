// @flow

import * as React from 'react';
import { withRouter } from 'react-router';
import { toObject as queryToObject } from 'query-parse';
import Wiki, { type PageObjT } from './index';

type PropsT = {
  location: *,
  match: {
    params: PageObjT
  },
  history: Object,
  embed: boolean
};

/**
 * Wraps the wiki for the router and handles URL changes
 */
function WikiWrapper(props: PropsT) {
  return (
    <Wiki
      pageObj={{
        wikiId: props.match.params.wikiId,
        pageTitle: props.match.params.pageTitle,
        instance: props.match.params.instance
      }}
      // Function to navigate to a page
      setPage={(pageObj: PageObjT, replace?: boolean) => {
        if (pageObj.instance) {
          replace
            ? props.history.replace(
                `/wiki/${pageObj.wikiId}/${pageObj.pageTitle}/${pageObj.instance}`
              )
            : props.history.push(
                `/wiki/${pageObj.wikiId}/${pageObj.pageTitle}/${pageObj.instance}`
              );
        } else if (pageObj.pageTitle) {
          replace
            ? props.history.replace(
                `/wiki/${pageObj.wikiId}/${pageObj.pageTitle}`
              )
            : props.history.push(
                `/wiki/${pageObj.wikiId}/${pageObj.pageTitle}`
              );
        } else if (pageObj.wikiId) {
          replace
            ? props.history.replace(`/wiki/${pageObj.wikiId}`)
            : props.history.push(`/wiki/${pageObj.wikiId}`);
        }
      }}
      query={queryToObject(props.location.search.slice(1))}
    />
  );
}

export default withRouter(WikiWrapper);
