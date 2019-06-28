import * as React from 'react';
import Wiki from '../Wiki';

export default function WikiTest(props) {
    const pageObj = {
        wikiId: props.match.params.wikiId,
        pageId: props.match.params.pageId || null,
        instanceId: props.match.params.instanceId || null
    }
    return <Wiki pageObj={pageObj} setPage={pageObj => console.log(pageObj)} embed/>
}