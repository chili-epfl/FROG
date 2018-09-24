// @flow

import * as React from 'react';

import { Button, List, ListItem, Paper, Grid } from '@material-ui/core';

import { uuid } from 'frog-utils';

import Icon from './Icon';
import {
  initDashboardDocuments,
  hasDashExample,
  Logs
} from './dashboardInPreviewAPI';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { addDefaultExample } from './index';

const names = `Chen Li,Maurice,Edgar,Noel,Ole,Stian,Jenny,Prastut,Louis,Monte Rosa,Lyskamm,Weisshorn,Matterhorn,Dent Blanche,Grand Combin,Finsteraarhorn,Zinalrothorn,Alphubel,Rimpfischhorn,Aletschhorn,Strahlhorn,Dent d'Hérens,Breithorn,Jungfrau,Mönch,Schreckhorn,Ober Gabelhorn,Piz Bernina,Gross Fiescherhorn,Gross Grünhorn,Weissmies,Lagginhorn,Piz Zupò,Gletscherhorn,Eiger,Grand Cornier,Piz Roseg,Bietschhorn,Trugberg,Gross Wannenhorn,Aiguille d'Argentière,Ruinette,Bouquetins,Tour Noir,Nesthorn,Mont Dolen`.split(
  ','
);

export const getUserId = (name: string) =>
  'uid_' + name.toLowerCase().replace(/\s+/, '');

const groupName = idx => 'group' + (1 + Math.floor(idx / 2));

const Controls = (props: Object) => {
  const {
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
    setInstances
  } = props;
  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return <p>Choose and activityType</p>;
  }
  const examples = addDefaultExample(activityType);

  const refresh = ex => {
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

  return (
    <div style={{ overflow: 'auto' }}>
      <Grid container>
        <Grid item xs={8}>
          <div style={{ margin: '1em' }} > 
            <Icon
              onClick={() => setShowData(!showData)}
              icon={showData ? 'fa fa-address-card-o' : 'fa fa-table'}
              tooltip={showData ? 'Show component' : 'Show underlying data'}
            />
            {activityType.dashboards && (
              <Icon
                onClick={() => setShowDash(!showDash)}
                icon="fa fa-tachometer"
                color={showDash ? '#3d76b8' : '#b3cae6'}
                tooltip="Toggle dashboard"
              />
            )}
            {hasDashExample(activityType) && (
              <Icon
                onClick={() => setShowDashExample(!showDashExample)}
                icon="fa fa-line-chart"
                color={showDashExample ? '#3d76b8' : '#b3cae6'}
                tooltip="Toggle example logs dashboard"
              />
            )}
            <Icon
              onClick={() => setShowLogs(!showLogs)}
              icon="fa fa-list"
              color={showLogs ? '#3d76b8' : '#b3cae6'}
              tooltip="Toggle log table"
            />
            <Icon
              onClick={addStudent}
              icon="fa fa-user-plus"
              color="#3d76b8"
              tooltip="Add a user"
            />
            <Icon
              onClick={removeStudent}
              icon="fa fa-user-times"
              color={users.length > 1 ? '#3d76b8' : '#b3cae6'}
              tooltip="Remove one user"
            />
            <Icon
              onClick={switchPlane}
              icon={
                ['fa fa-user-circle-o', 'fa fa-users', 'fa fa-university'][
                  plane - 1
                ]
              }
              color="#3d76b8"
              tooltip="Change plane"
            />
            <Icon
              onClick={refresh}
              icon="fa fa-refresh"
              tooltip="Reset reactive data"
            />
            <Icon
              onClick={() => setFullWindow(!fullWindow)}
              icon="fa fa-arrows-alt"
              tooltip="Toggle full window"
            />
          </div>
        </Grid>

        <Grid item xs={4}>
          <Button
            style={{ float: 'right', margin: '1em' }}
            onClick={_dismiss}
            data-tip="Close, and show list of activity types to preview"
            size={'small'}
            color={'secondary'}
            variant={'contained'}
          >
          X
          </Button>
        </Grid>    

        <Grid item xs={12}>
          {!showDashExample && (
            <List>
              {examples.map((ex, i) => (
                <Paper
                  style = {{float: "left", margin: "3px"}}
                >
                  <ListItem
                    button
                    selected={example === i? true: false} 
                    className="examples"
                    centered
                    style={ex.type === 'deeplink' ? { fontStyle: 'italic' } : {}}
                    onClick={() => {
                      if (modal) {
                        refresh(i);
                      } else {
                        const exConf = ex.config;
                        setConfig(exConf);
                      }
                      setReloadAPIform(uuid());
                      initDashboardDocuments(activityType, true);
                      setExample(i);
                    }}
                  >
                    {ex.title}
                  </ListItem>
                </Paper>
              ))}
            </List> 
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Controls;
