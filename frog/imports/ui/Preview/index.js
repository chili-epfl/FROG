// @flow
import React from 'react';
import { toObject, toString } from 'query-parse';
import { withRouter } from 'react-router';
import { omitBy } from 'lodash';
import List, { ListItem, ListSubheader, ListItemText } from 'material-ui/List';

import { StatelessPreview } from './Preview';
import { activityTypes } from '../../activityTypes';

const styles = {
  sheet: {
    padding: 0,
    maxHeight: '100%',
    overflow: 'auto'
  }
};

const ActivityList = ({ history }) => (
  <div style={styles.sheet}>
    <List subheader={<ListSubheader>Select to Preview</ListSubheader>}>
      {activityTypes.map(act => (
        <ListItem
          key={act.id}
          dense
          button
          onClick={() => history.push(`/preview/${act.id}`)}
        >
          <ListItemText primary={act.id} />
        </ListItem>
      ))}
    </List>
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
    windows: windowsRaw,
    showLogs: showLogsRaw
  } = toObject(search.slice(1));
  const windows = parseInt(windowsRaw, 10) || 1;
  const showData = showDataRaw === 'true';
  const showDash = showDashRaw === 'true';
  const fullWindow = fullWindowRaw === 'true';
  const showLogs = showLogsRaw === 'true';
  const dismiss = () => history.push(`/preview`);

  const changeURL = merge => {
    const e = {
      ...{ showData, showDash, fullWindow, windows, example, activityTypeId },
      ...merge
    };
    const opts = toString(
      omitBy(
        {
          showData: e.showData,
          showDash: e.showDash,
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
