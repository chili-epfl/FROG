// @flow

import * as React from 'react';
import { withRouter } from 'react-router';
import Wiki from './index';

type PropsT = {
    location: *,
    match: {
      params: {
        wikiId: string,
        pageTitle: ?string,
        instance?: string
      }
    },
    history: Object,
    embed: boolean
};

class WikiWrapper extends React.Component<PropsT> {
    render() {
        return <Wiki
        pageObj={{
            wikiId: this.props.match.params.wikiId,
            pageTitle: this.props.match.params.pageTitle,
            instance: this.props.match.params.instance
        }}
        setPage={pageObj => {
            if (pageObj.instance) {
                this.props.history.push(`/wiki/${pageObj.wikiId}/${pageObj.pageTitle}/${pageObj.instance}`);
            } else if (pageObj.pageTitle) {
                this.props.history.push(`/wiki/${pageObj.wikiId}/${pageObj.pageTitle}`);
            } else if (pageObj.wikiId) {
                this.props.history.push(`/wiki/${pageObj.wikiId}`);
            }
        }}
        query={this.props.location.search.slice(1)}
        />
    }
};

export default withRouter(WikiWrapper);