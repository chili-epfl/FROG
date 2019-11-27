// @flow

import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import { blueGrey } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import { Fab, Button } from '@material-ui/core';
import { uuid } from '/imports/frog-utils';
import { connection } from './Preview';

import Icon from './Icon';
import {
  initDashboardDocuments,
  hasDashExample,
  Logs
} from './dashboardInPreviewAPI';
import { initActivityDocuments, DocId } from './Content';
import { activityTypesObj } from '/imports/activityTypes';
import { addDefaultExample } from './index';

const styles = theme => ({
  root: {
    padding: '4px',
    margin: '4px',
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    border: '1px solid #EAEAEA'
  },
  closeButton: {
    float: 'right',
    margin: '5px',
    height: '35px',
    width: '35px',
    backgroundColor: blueGrey[50],
    color: blueGrey[500],
    boxShadow: 'none'
  },
  exampleButton: {
    textTransform: 'none'
  },
  exampleButtonDeeplink: {
    textTransform: 'none',
    fontStyle: 'italic'
  }
});

const names = `Chen Li,Maurice,Edgar,Noel,Ole,Stian,Jenny,Prastut,Louis,Monte Rosa,Lyskamm,Weisshorn,Matterhorn,Dent Blanche,Grand Combin,Finsteraarhorn,Zinalrothorn,Alphubel,Rimpfischhorn,Aletschhorn,Strahlhorn,Dent d'Hérens,Breithorn,Jungfrau,Mönch,Schreckhorn,Ober Gabelhorn,Piz Bernina,Gross Fiescherhorn,Gross Grünhorn,Weissmies,Lagginhorn,Piz Zupò,Gletscherhorn,Eiger,Grand Cornier,Piz Roseg,Bietschhorn,Trugberg,Gross Wannenhorn,Aiguille d'Argentière,Ruinette,Bouquetins,Tour Noir,Nesthorn,Mont Dolen`.split(
  ','
);

export const getUserId = (name: string): string =>
  'uid_' + name.toLowerCase().replace(/\s+/, '');

export const groupName = (idx: number): string =>
  'group' + (1 + Math.floor(idx / 2));

export default withStyles(styles)((props: Object) => {
  const {
    classes,
    activityTypeId,
    instances,
    config,
    dismiss,
    setFullWindow,
    fullWindow,
    example,
    setConfig,
    setShowData,
    showData,
    setShowDash,
    showDash,
    setShowDashExample,
    showDashExample,
    setShowLogs,
    setReloadAPIform,
    setReloadActivity,
    showLogs,
    setActivityTypeId,
    setExample,
    plane,
    users,
    modal,
    setUsers,
    setPlane,
    setInstances,
    storeTemplateFn
  } = props;
  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return <p>Choose and activityType</p>;
  }
  const examples = addDefaultExample(activityType);

  const refresh = ex => {
    props.setDelay(true);
    setTimeout(() => {
      initActivityDocuments(
        instances,
        activityType,
        ex === undefined ? example : ex,
        config,
        true
      );
      // resets the reactive documents for the dashboard
      initDashboardDocuments(activityType, true);
      Logs.length = 0;
      setReloadActivity(uuid());
      props.setDelay(false);
    }, 50);
  };

  const _dismiss = () => {
    setFullWindow(false);
    if (dismiss) {
      dismiss();
    } else {
      setActivityTypeId(null);
      setExample(0);
      setConfig({});
      setReloadAPIform(uuid());
      Logs.length = 0;
    }
  };

  const addStudent = () => {
    const newName = names[users.length % names.length];
    const newGroup = groupName(users.length);
    const newId = getUserId(newName);
    setUsers([...users, newName]);
    const newInstances = [...instances, [newId, newGroup, 'all'][plane - 1]];
    setInstances(newInstances);
    initActivityDocuments(newInstances, activityType, example, config, false);
  };

  const removeStudent = () => {
    setUsers(users.slice(0, users.length - 1));
    const newInstances = instances.slice(0, instances.length - 1);
    setInstances(newInstances);
    initActivityDocuments(newInstances, activityType, example, config, false);
  };

  const switchPlane = () => {
    const newPlane = 1 + (plane % 3);
    setPlane(newPlane);
    const newInstances = users.map(
      (n, i) => [getUserId(n), groupName(i), 'all'][newPlane - 1]
    );
    setInstances(newInstances);
    initActivityDocuments(newInstances, activityType, example, config, false);
  };

  const calculateAndStore = async () => {
    const rz = await new Promise(resolve => {
      const doc = connection.get('rz', DocId(activityType.id, instances[0]));
      doc.fetch(() => resolve(doc.data));
    });
    const lis = await new Promise(resolve => {
      connection.createFetchQuery('li', {}, {}, (err, result) =>
        resolve(
          result.reduce((acc, x) => {
            acc[x.id] = x.data;
            return acc;
          }, {})
        )
      );
    });
    storeTemplateFn({ rz, lis });
  };

  const iconActive = '#22A6B3';
  const iconInactive = blueGrey[200];

  return (
    <Paper className={classes.root}>
      {!storeTemplateFn && (
        <Fab
          onClick={_dismiss}
          className={classes.closeButton}
          data-tip="Close"
        >
          <CloseIcon />
        </Fab>
      )}

      {storeTemplateFn ? (
        <div
          style={{ display: 'flex', alignItems: 'center', fontSize: '1.25em' }}
        >
          <span>
            <Icon
              onClick={calculateAndStore}
              icon="fa fa-floppy-o"
              tooltip="Store data as template for the activity"
              color={iconActive}
            />
            <Icon
              onClick={refresh}
              icon="fa fa-refresh"
              tooltip="Reset reactive data"
              color={iconActive}
            />
          </span>
          <p
            style={{
              textAlign: 'center',
              fontSize: '1.25rem',
              fontWeigh: '500',
              margin: '0px 15px'
            }}
          >
            Activity preview
          </p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '1.25em' }}>
            <Icon
              onClick={() => setShowData(!showData)}
              icon={showData ? 'fa fa-address-card-o' : 'fa fa-table'}
              tooltip={showData ? 'Show component' : 'Show underlying data'}
              color={iconActive}
            />
            {activityType.dashboards && (
              <Icon
                onClick={() => setShowDash(!showDash)}
                icon="fa fa-tachometer"
                color={showDash ? iconActive : iconInactive}
                tooltip="Toggle dashboard"
              />
            )}
            {hasDashExample(activityType) && (
              <Icon
                onClick={() => setShowDashExample(!showDashExample)}
                icon="fa fa-line-chart"
                color={showDashExample ? iconActive : iconInactive}
                tooltip="Toggle example logs dashboard"
              />
            )}
            <Icon
              onClick={() => setShowLogs(!showLogs)}
              icon="fa fa-list"
              color={showLogs ? iconActive : iconInactive}
              tooltip="Toggle log table"
            />
            <Icon
              onClick={addStudent}
              icon="fa fa-user-plus"
              color={iconActive}
              tooltip="Add a user"
            />
            <Icon
              onClick={removeStudent}
              icon="fa fa-user-times"
              color={users.length > 1 ? iconActive : iconInactive}
              tooltip="Remove one user"
            />
            <Icon
              onClick={switchPlane}
              icon={
                ['fa fa-user-circle-o', 'fa fa-users', 'fa fa-university'][
                  plane - 1
                ]
              }
              color={iconActive}
              tooltip="Change plane"
            />
            <Icon
              onClick={refresh}
              icon="fa fa-refresh"
              tooltip="Reset reactive data"
              color={iconActive}
            />
            <Icon
              onClick={() => setFullWindow(!fullWindow)}
              icon="fa fa-arrows-alt"
              tooltip="Toggle full window"
              color={iconActive}
            />
          </div>
          {!showDashExample && (
            <div>
              {examples.map((ex, i) => (
                <Button
                  value={i}
                  key={ex.title}
                  variant={i === example ? 'contained' : 'text'}
                  disableRipple
                  disableTouchRipple
                  color="primary"
                  style={
                    i === example
                      ? { color: 'white', boxShadow: 'none' }
                      : { color: iconActive }
                  }
                  className={
                    'example ' +
                    (ex.type === 'deeplink'
                      ? classes.exampleButtonDeeplink
                      : classes.exampleButton)
                  }
                  onClick={() => {
                    if (modal) {
                      refresh(i);
                    } else {
                      setConfig(ex.config);
                    }
                    setReloadAPIform(uuid());
                    initDashboardDocuments(activityType, true);
                    setExample(i);
                  }}
                >
                  {ex.title}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </Paper>
  );
});
