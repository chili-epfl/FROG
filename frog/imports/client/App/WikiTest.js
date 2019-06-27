import * as React from 'react';
import Wiki from '../Wiki';

export default function WikiTest(props) {
    const pageObj = {
        wikiId: props.match.wikiId,
        pageId: props.match.pageId || null,
        instanceId: props.match.instanceId || null
    }
    return <Wiki embeddedPage={pageObj} />
}