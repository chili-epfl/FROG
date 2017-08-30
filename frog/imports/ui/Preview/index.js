// @flow
import React from 'react';
import { toObject as queryToObject } from 'query-parse';
import { withRouter } from 'react-router';
import { A } from 'frog-utils';

import { StatelessPreview } from '../GraphEditor/Preview';
import { activityTypes } from '../../activityTypes';

const ActivityList = ({ history }) => (
  <div>
    <h2>Choose activity to preview</h2>
    <ul>
      {activityTypes.map(act => (
        <li key={act.id}>
          <A onClick={() => history.push(`/preview/${act.id}`)}>{act.id}</A>
        </li>
      ))}
    </ul>
  </div>
);

const PreviewPage = ({
  match: { params: { activityTypeId = null, example = 0 } },
  location: { search },
  history
}) => {
  const showData = queryToObject(search.slice(1)).showData === 'true';
  const setExample = ex =>
    history.push(`/preview/${activityTypeId || ''}/${ex}`);
  const setShowData = ex =>
    history.push(`/preview/${activityTypeId || ''}/${example}?showData=${ex}`);
  const dismiss = () => history.push(`/preview`);
  return activityTypeId ? (
    <StatelessPreview
      {...{
        activityTypeId,
        example,
        setExample,
        showData,
        setShowData,
        dismiss,
        isSeparatePage: true
      }}
    />
  ) : (
    <ActivityList history={history} />
  );
};

PreviewPage.displayName = 'PreviewPage';
export default withRouter(PreviewPage);
