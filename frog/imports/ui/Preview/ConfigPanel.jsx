// @flow

import * as React from 'react';
import { uuid } from 'frog-utils';
import { isEqual } from 'lodash';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { LibraryStates } from '/imports/api/cache';
import { updateActivity } from '/imports/api/remoteActivities';
import ApiForm, { check } from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';
import { addDefaultExample } from './index';
import ExportButton from '../GraphEditor/SidePanel/ActivityPanel/ExportButton';

const styles = {
  side: {
    flex: '0 0 auto',
    overflowY: 'auto',
    width: '350px',
    background: 'white'
  }
};

class ConfigPanel extends React.Component<*, *> {
  constructor(props: Object) {
    super(props);
    this.state = { displaySave: false, metadatas: {} };
    if (!props.metadatas) {
      const metadatas = LibraryStates.activityList.find(
        x => x.uuid === props.state.metadatas.uuid
      );
      props.setMetadatas(metadatas);
    }
  }

  onConfigChange = (e: any) => {
    if (JSON.stringify(e.config) !== JSON.stringify(this.props.config)) {
      this.setState({ displaySave: true });
    }
    if (e.errors && e.errors.length === 0) {
      const aT = activityTypesObj[e.activityType];
      this.props.setConfig(e.config);
      initActivityDocuments(
        this.props.instances,
        aT,
        this.props.example,
        e.config,
        true
      );
      initDashboardDocuments(aT, true);
    } else {
      this.props.setConfig({ ...e.config, invalid: true });
    }
    this.props.setActivityTypeId(e.activityType);
    this.forceUpdate();
  };

  shouldComponentUpdate = (nextProps: any) => {
    if (
      !isEqual(nextProps.config, this.props.config) ||
      this.props.activityId !== nextProps.activityId ||
      this.props.metadatas !== nextProps.metadatas
    ) {
      return true;
    } else {
      return false;
    }
  };

  componentDidUpdate = () => {
    this.setState({ displaySave: false });
    if (this.props.activityTypeId && this.props.config.invalid === undefined) {
      check(
        this.props.activityTypeId,
        this.props.config,
        () => {},
        this.onConfigChange
      );
    }
  };

  backToPreview = () => {
    const {
      setConfig,
      setExample,
      setReloadAPIform,
      setActivityTypeId
    } = this.props;

    setActivityTypeId(null);
    setExample(0);
    setConfig({});
    setReloadAPIform(uuid());
  };

  render() {
    const {
      config,
      reloadAPIform,
      setConfig,
      setExample,
      setShowDashExample,
      activityTypeId,
      metadatas,
      setMetadatas,
      setReloadAPIform,
      setActivityTypeId,
      showDash,
      setShowDash,
      instances
    } = this.props;
    return (
      <div style={styles.side}>
        {activityTypeId && (
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={2}>
              <IconButton
                className="arrowback"
                aria-label="back-to-preview"
                onClick={this.backToPreview}
              >
                <ArrowBack />
              </IconButton>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="title">
                {activityTypesObj[activityTypeId].meta.name}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              {metadatas.uuid &&
                this.state.displaySave && (
                  <Button
                    color="primary"
                    style={{ left: '-25px' }}
                    onClick={() => {
                      updateActivity(metadatas.uuid, {
                        ...metadatas,
                        data: { ...config }
                      });
                      this.forceUpdate();
                    }}
                  >
                    Save
                  </Button>
                )}
              <ExportButton
                activity={{
                  title: activityTypesObj[activityTypeId].meta.name,
                  data: config,
                  activityType: activityTypeId,
                  metadatas,
                  setMetadatas
                }}
                {...{ metadatas, setMetadatas }}
                updateParent={() => this.forceUpdate()}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {metadatas.uuid && (
              <div
                style={{
                  backgroundColor: '#dbdbdb',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  padding: '10px'
                }}
              >
                <h3>Cloud metadata:</h3>
                <TextField
                  id="name"
                  label="Title"
                  value={metadatas.title}
                  onChange={e => {
                    metadatas.title = e.target.value;
                    setMetadatas(metadatas);
                    this.setState({ displaySave: true });
                    this.forceUpdate();
                  }}
                  name="title"
                  margin="normal"
                />
                <TextField
                  label="Description"
                  value={metadatas.description}
                  multiline
                  onChange={e => {
                    metadatas.description = e.target.value;
                    setMetadatas(metadatas);
                    this.setState({ displaySave: true });
                    this.forceUpdate();
                  }}
                  id="exampleFormControlTextarea1"
                  rows="3"
                />
                <div style={{ height: '20px' }} />
                <TagsInput
                  value={metadatas.tags}
                  onChange={e => {
                    metadatas.tags = e;
                    setMetadatas(metadatas);
                    this.setState({ displaySave: true });
                    this.forceUpdate();
                  }}
                />
                <div style={{ height: '10px' }} />
              </div>
            )}
          </Grid>
        )}
        <ApiForm
          hidePreview
          {...{ config, setConfig, setActivityTypeId, setMetadatas }}
          activityType={activityTypeId}
          onConfigChange={this.onConfigChange}
          onSelect={activityType => {
            const exConf = activityType.title
              ? activityType.config
              : addDefaultExample(activityTypesObj[activityType])[0].config;
            const actTypeId = activityType.title
              ? activityType.activity_type
              : activityType;
            setConfig(exConf);
            const newMetadatas = activityType.uuid
              ? LibraryStates.activityList.find(
                  x => x.uuid === activityType.uuid
                )
              : { uuid: '', title: '', description: '', tags: [] };
            this.props.setMetadatas(newMetadatas);
            if (showDash && !activityTypesObj[actTypeId].dashboard) {
              setShowDash(false);
            }
            setReloadAPIform(uuid());
            initActivityDocuments(
              instances,
              activityTypesObj[actTypeId],
              0,
              exConf,
              true
            );
            initDashboardDocuments(actTypeId, true);
            setExample(0);
            setShowDashExample(false);
            setActivityTypeId(actTypeId);
          }}
          reload={reloadAPIform}
        />
      </div>
    );
  }
}

export default ConfigPanel;
