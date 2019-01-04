// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { LibraryStates } from '/imports/api/cache';
import { updateActivity } from '/imports/api/remoteActivities';
import ApiForm, { check } from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '/imports/activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';
import { addDefaultExample } from './index';
import ExportButton from '../GraphEditor/SidePanel/ActivityPanel/ExportButton';

const styles = () => ({
  side: {
    flex: '0 0 350px',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  metadataContainer: {
    backgroundColor: '#dbdbdb',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '10px'
  },
  formContainer: {
    flex: '1 0 0px',
    overflow: 'auto'
  }
});

const MetadataModal = withStyles(styles)(
  ({ classes, metadatas, setState, forceUpdate, setMetadatas }) => (
    <div className={classes.metadataContainer}>
      <h3>Cloud metadata:</h3>
      <TextField
        id="name"
        label="Title"
        value={metadatas.title}
        onChange={e => {
          metadatas.title = e.target.value;
          setMetadatas(metadatas);
          setState({ displaySave: true });
          forceUpdate();
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
          setState({ displaySave: true });
          forceUpdate();
        }}
        id="exampleFormControlTextarea1"
        rows="3"
      />
      <TagsInput
        value={metadatas.tags}
        onChange={e => {
          metadatas.tags = e;
          setMetadatas(metadatas);
          setState({ displaySave: true });
          forceUpdate();
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!!metadatas.is_public}
            onChange={() => {
              metadatas.is_public = !metadatas.is_public;
              setMetadatas(metadatas);
              setState({ displaySave: true });
              forceUpdate();
            }}
            color="default"
          />
        }
        label="Make public"
      />
      <div style={{ height: '10px' }} />
    </div>
  )
);

class ConfigPanel extends React.Component<*, *> {
  timeout: any;

  constructor(props: Object) {
    super(props);
    this.state = { displaySave: false, metadatas: {} };
    if (!props.metadatas) {
      const { metadatas } = this.state;
      const _metadatas = LibraryStates.activityList.find(
        x => x.uuid === metadatas.uuid
      );
      props.setMetadatas(_metadatas);
    }
  }

  onConfigChange = (e: any) => {
    const {
      setDelay,
      config,
      setConfig,
      metadatas,
      instances,
      example,
      setActivityTypeId
    } = this.props;
    setDelay(true);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      if (
        metadatas.owner_id === Meteor.user().username &&
        JSON.stringify(e.config) !== JSON.stringify(config)
      ) {
        this.setState({ displaySave: true });
      }
      if (e.errors && e.errors.length === 0) {
        const aT = activityTypesObj[e.activityType];
        setConfig(e.config);
        initActivityDocuments(instances, aT, example, e.config, true);
        initDashboardDocuments(aT, true);
      } else {
        setConfig({ ...e.config, invalid: true });
      }
      setActivityTypeId(e.activityType);
      this.forceUpdate();
      setDelay(false);
    }, 50);
  };

  shouldComponentUpdate = (nextProps: any) => {
    const { activityId, metadatas, config } = this.props;
    return (
      activityId !== nextProps.activityId ||
      metadatas !== nextProps.metadatas ||
      !isEqual(nextProps.config, config)
    );
  };

  componentDidUpdate = () => {
    this.setState({ displaySave: false });
    const { activityTypeId, config } = this.props;
    if (activityTypeId && config.invalid === undefined) {
      check(activityTypeId, config, () => {}, this.onConfigChange);
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

  onSelectActivityType = activityType => {
    const {
      showDash,
      setShowDash,
      instances,
      setConfig,
      setReloadAPIform,
      setExample,
      setShowDashExample,
      setActivityTypeId,
      setMetadatas
    } = this.props;

    const exConf = activityType.title
      ? activityType.config
      : addDefaultExample(activityTypesObj[activityType])[0].config;
    const actTypeId = activityType.title
      ? activityType.activity_type
      : activityType;
    const aTObj = activityTypesObj[actTypeId];
    setConfig(exConf);
    const newMetadatas = activityType.uuid
      ? LibraryStates.activityList.find(x => x.uuid === activityType.uuid)
      : { uuid: '', title: '', description: '', tags: [] };
    setMetadatas(newMetadatas);
    if (showDash && !aTObj.dashboards) {
      setShowDash(false);
    }
    setReloadAPIform(uuid());
    initActivityDocuments(instances, aTObj, 0, exConf, true);
    initDashboardDocuments(actTypeId, true);
    setExample(0);
    setShowDashExample(false);
    setActivityTypeId(actTypeId);
  };

  render() {
    const {
      config,
      reloadAPIform,
      setConfig,
      activityTypeId,
      metadatas,
      setMetadatas,
      setActivityTypeId,
      classes
    } = this.props;

    const { displaySave } = this.state;

    return (
      <div className={classes.side}>
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
              <Typography variant="h6">
                {activityTypesObj[activityTypeId].meta.name}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              {metadatas.uuid && displaySave && (
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
              <MetadataModal
                metadatas={metadatas}
                setMetadatas={x => setMetadatas(x)}
                forceUpdate={() => this.forceUpdate()}
                setState={x => this.setState(x)}
              />
            )}
          </Grid>
        )}
        <div className={classes.formContainer}>
          <ApiForm
            hidePreview
            {...{ config, setConfig, setActivityTypeId, setMetadatas }}
            activityType={activityTypeId}
            onConfigChange={this.onConfigChange}
            onSelect={this.onSelectActivityType}
            reload={reloadAPIform}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ConfigPanel);
