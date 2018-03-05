// @flow
import * as React from 'react';
import { toObject, toString } from 'query-parse';
import { withRouter } from 'react-router';
import { A } from 'frog-utils';
import { omitBy } from 'lodash';

import { StatelessPreview } from './Preview';
import { activityTypes } from '../../activityTypes';

const ActivityList = ({ history }) => (
  <div>
    <h2>Choose activity to preview</h2>
    <ul>
      {activityTypes.filter(x => x.meta.exampleData).map(act => (
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
    showDashExample: showDashExampleRaw,
    fullWindow: fullWindowRaw,
    windows: windowsRaw,
    showLogs: showLogsRaw
  } = toObject(search.slice(1));
  const windows = parseInt(windowsRaw, 10) || 1;
  const showData = showDataRaw === 'true';
  const showDash = showDashRaw === 'true';
  const showDashExample = showDashExampleRaw === 'true';
  const fullWindow = fullWindowRaw === 'true';
  const showLogs = showLogsRaw === 'true';
  const dismiss = () => history.push(`/preview`);

  const changeURL = merge => {
    const e = {
      ...{
        showData,
        showDash,
        fullWindow,
        windows,
        example,
        activityTypeId,
        showDashExample
      },
      ...merge
    };
    const opts = toString(
      omitBy(
        {
          showData: e.showData,
          showDash: e.showDash,
          showDashExample: e.showDashExample,
          fullWindow: e.fullWindow,
          windows: e.windows,
          showLogs: e.showLogs
        },
        x => !x
      )
    );
    history.push(`/preview/${e.activityTypeId || ''}/${e.example}?${opts}`);
  };

  const setShowDash = x => changeURL({ showDash: x, showLogs: false });
  const setShowDashExample = x =>
    changeURL({
      showDashExample: x,
      showLogs: false,
      showDash: false,
      example: 0
    });
  const setShowLogs = x => changeURL({ showLogs: x, showDash: false });
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
        showDashExample,
        setShowDashExample,
        dismiss,
        setShowLogs,
        showLogs,
        isSeparatePage: true
      }}
    />
  ) : (
    <ActivityList history={history} />
  );
};

PreviewPage.displayName = 'PreviewPage';
export default withRouter(PreviewPage);
