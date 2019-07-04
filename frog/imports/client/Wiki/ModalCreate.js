// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  Typography
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import OperatorForm from '../GraphEditor/SidePanel/OperatorForm';
import { activityTypesObj } from '/imports/activityTypes';

type StateT = {
  currentTab: number,
  pageTitle: string,
  pageTitleValid: boolean,
  socialPlane: number,
  open: boolean,
  expanded: boolean,
  allowView: boolean,
  allowEdit: boolean,
  activityConfig?: Object,
  operatorConfig?: Object
};

type PropsT = {
  classes: Object,
  onCreate: Function,
  setModalOpen: Function,
  clearError: Function,
  errorDiv: any,
  wikiId: string
};

const styles = () => ({
  formControl: {
    margin: 8
  },
  selectSocialPlane: {
    width: '7vw',
    minWidth: '135px'
  },
  modalInner: {
    height: '45vh',
    padding: 16
  },
  expander: {
    margin: 'auto'
  },
  tabs: {
    fontSize: 'inherit',
    color: '#fff'
  },
  selectHeading: {
    fontSize: 'inherit'
  }
});

class NewPageModal extends React.Component<PropsT, StateT> {
  constructor(props: PropsT) {
    super(props);
    this.state = {
      currentTab: 0,
      pageTitle: '',
      pageTitleValid: true,
      open: true,
      expanded: false,
      socialPlane: 3,
      allowView: true,
      allowEdit: true
    };
  }

  handleTitleChange = (e: any) => {
    this.handleErrorClearing(e.target.value);
    this.setState({ pageTitle: e.target.value });
  };

  handleTabs = (e: any, value: number) => {
    this.setState({ currentTab: value });
  };

  handleSocialPlaneChange = (e: any) => {
    if (e.target.value === 'everyone') {
      this.setState({
        socialPlane: e.target.value,
        allowView: true,
        allowEdit: true
      });
    } else {
      this.setState({ socialPlane: e.target.value });
    }
  };

  handleChangeAllowView = () => {
    this.setState({ allowView: !this.state.allowView });
  };

  handleChangeAllowEdit = () => {
    this.setState({ allowEdit: !this.state.allowEdit });
  };

  handleConfig = conf => {
    this.setState({ activityConfig: conf });
  };

  handleCreate = () => {
    const {
      pageTitle,
      socialPlane,
      activityConfig,
      operatorConfig
    } = this.state;
    this.props.onCreate(pageTitle, socialPlane, activityConfig, operatorConfig);
  };

  // Clears error messages if the user tries to create a page with an empty title and then types in a new title
  handleErrorClearing(currentTitle: string) {
    if (
      currentTitle === '' ||
      (currentTitle.length > 0 &&
        this.props.errorDiv === 'Title cannot be empty')
    )
      this.props.clearError();
  }

  render() {
    const { currentTab, socialPlane, expanded, pageTitle } = this.state;
    const { classes, errorDiv } = this.props;
    let operatorTypesList = [];
    const activityType = this.state.config?.activityType;
    if (
      activityType &&
      activityTypesObj[activityType].meta.supportsLearningItems
    ) {
      operatorTypesList = ['op-twitter', 'op-rss', 'op-hypothesis'];
      if (socialPlane !== 'everyone') {
        operatorTypesList.push('op-aggregate');
      }
    }

    return (
      <Dialog
        open={this.state.open}
        onExited={() => {
          this.props.setModalOpen(false);
          this.props.clearError();
        }}
        onEnter={() => {
          this.props.setModalOpen(true);
          this.props.clearError();
        }}
        onEscapeKeyDown={() => this.props.setModalOpen(false)}
        onKeyDown={e => {
          if (e.keyCode === 13 && this.props.errorDiv !== null)
            this.handleCreate();
        }}
        scroll="paper"
      >
        <FormGroup>
          <FormControl className={classes.formControl}>
            <Typography variant="h6">Create New Page</Typography>
            <TextField
              autoFocus
              error={errorDiv !== null}
              id="page-title"
              value={pageTitle}
              onChange={this.handleTitleChange}
              label="Page Title"
              margin="normal"
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  this.handleCreate();
                } else if (e.keyCode === 40) {
                  this.setState({ expanded: true });
                } else if (e.keyCode === 38) {
                  this.setState({ expanded: false });
                }
              }}
            />
            {errorDiv !== null && (
              <FormHelperText error>{errorDiv}</FormHelperText>
            )}
          </FormControl>
        </FormGroup>
        <Collapse in={expanded} timeout="auto">
          <AppBar position="static">
            <Tabs
              value={this.state.currentTab}
              indicatorColor="secondary"
              onChange={this.handleTabs}
              variant="fullWidth"
            >
              <Tab label="Settings" className={classes.tabs} />
              <Tab label="Component" className={classes.tabs} />
              <Tab label="Operator" className={classes.tabs} />
            </Tabs>
          </AppBar>
          <DialogContent classes={{ root: classes.modalInner }}>
            {currentTab === 0 && (
              <FormGroup>
                <FormControl>
                  <Typography variant="h6">Social Plane</Typography>
                  <Select
                    value={this.state.socialPlane}
                    onChange={this.handleSocialPlaneChange}
                    id="social-plane"
                    className={classes.selectSocialPlane}
                  >
                    <MenuItem value={3}>Everyone</MenuItem>
                    <MenuItem value={1}>Each Individual</MenuItem>
                  </Select>
                </FormControl>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.allowView}
                        onChange={this.handleChangeAllowView}
                        color="primary"
                      />
                    }
                    disabled={socialPlane === 'everyone'}
                    label="Allow others to view"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.allowEdit}
                        onChange={this.handleChangeAllowEdit}
                        color="primary"
                      />
                    }
                    disabled={socialPlane === 'everyone'}
                    label="Allow others to edit"
                  />
                </FormGroup>
              </FormGroup>
            )}
            {currentTab === 1 && (
              <ApiForm
                categories={['Core', 'Other']}
                whiteList={[
                  'li-richText',
                  'ac-gallery',
                  'ac-brainstorm',
                  'ac-quiz',
                  'ac-ck-board',
                  'ac-text'
                ]}
                config={this.state.activityConfig?.config}
                activityType={this.state.activityConfig?.activityType}
                activityMapping={{
                  'li-richText': 'Core',
                  'ac-gallery': 'Core',
                  'ac-brainstorm': 'Other',
                  'ac-quiz': 'Core',
                  'ac-ck-board': 'Core',
                  'ac-text': 'Core'
                }}
                noOffset
                showDelete
                onConfigChange={e => this.handleConfig(e)}
                onSubmit={e => this.handleConfig(e)}
              />
            )}
            {currentTab === 2 && (
              <OperatorForm
                operatorType="product"
                config={this.state.operatorConfig?.config}
                categories={['From the web', 'From the current page']}
                operatorTypesList={operatorTypesList}
                operatorMappings={{
                  'op-twitter': 'From the web',
                  'op-rss': 'From the web',
                  'op-hypothesis': 'From the web',
                  'op-aggregate': 'From the current page'
                }}
                onConfigChange={e => this.setState({ operatorConfig: e })}
                onSubmit={e => this.setState({ operatorConfig: e })}
                allOpen
              />
            )}
          </DialogContent>
        </Collapse>
        <DialogActions>
          <IconButton
            className={classes.expander}
            onClick={() => this.setState({ expanded: !expanded })}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Button
            onClick={() => {
              this.props.setModalOpen(false);
              this.props.clearError();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => this.handleCreate()}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(NewPageModal);
