// @flow
import React from 'react';
import { toObject, toString } from 'query-parse';
import { withRouter } from 'react-router';
import { A } from 'frog-utils';

import { StatelessPreview } from './Preview';
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
  const {
    showData: showDataRaw,
    showDash: showDashRaw,
    fullWindow: fullWindowRaw,
    windows: rawWindows
  } = toObject(search.slice(1));
  const windows = parseInt(rawWindows, 10) || 1;
  const showData = showDataRaw === 'true';
  const showDash = showDashRaw === 'true';
  const fullWindow = fullWindowRaw === 'true';

  const dismiss = () => history.push(`/preview`);

  const changeURL = merge => {
    const e = {
      ...{ showData, showDash, fullWindow, windows, example, activityTypeId },
      ...merge
    };
    history.push(
      `/preview/${e.activityTypeId || ''}/${e.example}?${toString({
        showData: e.showData,
        showDash: e.showDash,
        fullWindow: e.fullWindow,
        windows: e.windows
      })}`
    );
  };

  const setShowDash = x => changeURL({ showDash: x });
  const setShowData = x => changeURL({ showData: x });
  const setWindows = x => changeURL({ windows: x });
  const setExample = x => changeURL({ example: x });
  const setFullWindow = x => changeURL({ fullWindow: x });

  return activityTypeId ? (
    <StatelessPreview
      {...{
        activityTypeId,
        setFullWindow,
        fullWindow,
        example,
        setExample,
        setWindows,
        windows,
        showData,
        setShowData,
        showDash,
        setShowDash,
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
