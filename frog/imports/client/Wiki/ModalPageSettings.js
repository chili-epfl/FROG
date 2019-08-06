// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
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
import { Promise } from 'q';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import OperatorForm from '../GraphEditor/SidePanel/OperatorForm';
import { activityTypesObj } from '/imports/activityTypes';
import {
  type PageSettingsT,
  DEFAULT_PAGE_SETTINGS
} from '/imports/api/wikiTypes';

type StateT = {
  currentTab: number,
  pageTitle: string,
  pageTitleValid: boolean,
  socialPlane: number,
  open: boolean,
  expanded: boolean,
  pageSettings: PageSettingsT,
  activityConfig?: Object,
  operatorConfig?: Object,
  error: ?string
};

type PropsT = {
  classes: Object,
  onSubmit: (
    title: string,
    socialPlane: number,
    activityConfig: Object,
    operatorConfig: Object,
    pageSettings: PageSettingsT
  ) => Promise,
  hideModal: () => void,
  isOwner: boolean,
  wikiId: string,
  pageSettings?: PageSettingsT,
  title: string,
  socialPlane: number,
  action: 'edit' | 'create'
};

const styles = () => ({
  root: {
    width: '600px'
  },
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

class PageSettingsModal extends React.Component<PropsT, StateT> {
  constructor(props: PropsT) {
    super(props);
    this.state = {
      currentTab: 0,

      pageTitle: this.props.title || '',
      pageTitleValid: true,
      open: true,
      expanded: false,
      socialPlane: this.props.socialPlane || 3,
      pageSettings: this.props.pageSettings || DEFAULT_PAGE_SETTINGS,
      error: null
    };
  }

  handleTitleChange = (e: any) => {
    this.setState({ pageTitle: e.target.value, error: null });
  };

  handleTabs = (e: any, value: number) => {
    this.setState({ currentTab: value });
  };

  handleSocialPlaneChange = (e: any) => {
    if (e.target.value === 3) {
      this.setState({
        socialPlane: 3,
        pageSettings: {
          ...this.state.pageSettings,
          allowView: true,
          allowEdit: true
        }
      });
    } else {
      this.setState({ socialPlane: e.target.value });
    }
  };

  handleCheckbox = target => e =>
    this.setState({
      ...this.state,
      pageSettings: { ...this.state.pageSettings, [target]: e.target.checked }
    });

  handleConfig = conf => {
    this.setState({ activityConfig: conf });
  };

  handleSubmit = () => {
    const {
      pageTitle,
      socialPlane,
      activityConfig,
      operatorConfig,
      pageSettings
    } = this.state;
    this.props
      .onSubmit(
        pageTitle,
        socialPlane,
        activityConfig,
        operatorConfig,
        pageSettings
      )
      .then(error => {
        this.setState({ ...this.state, error });
        if (!error) this.props.hideModal();
      });
  };

  render() {
    const { currentTab, socialPlane, expanded, pageTitle, error } = this.state;
    const { classes, isOwner, action } = this.props;
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
        open
        onEscapeKeyDown={this.props.hideModal}
        onKeyDown={e => {
          if (e.keyCode === 13 && error === null) {
            this.handleSubmit();
          }
        }}
        maxWidth={false}
        scroll="paper"
      >
        <div className={classes.root}>
          <FormGroup>
            <FormControl className={classes.formControl}>
              <Typography variant="h6">
                {action === 'create' ? 'Create New Page' : 'Edit Page Settings'}
              </Typography>
              <TextField
                autoFocus
                error={error !== null}
                id="page-title"
                value={pageTitle}
                onChange={this.handleTitleChange}
                label="Page Title"
                margin="normal"
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    this.handleSubmit();
                  } else if (e.keyCode === 40) {
                    this.setState({ expanded: true });
                  } else if (e.keyCode === 38) {
                    this.setState({ expanded: false });
                  }
                }}
                data-testid="wiki_page_title_editor"
              />
              {error !== null && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
          </FormGroup>
          <Collapse in={expanded || action === 'edit'} timeout="auto">
            {action === 'create' && (
              <AppBar position="static">
                <Tabs
                  value={this.state.currentTab}
                  indicatorColor="secondary"
                  onChange={this.handleTabs}
                  variant="fullWidth"
                >
                  <Tab label="Settings" className={classes.tabs} />
                  <Tab label="Component" className={classes.tabs} />
                </Tabs>
              </AppBar>
            )}
            <DialogContent classes={{ root: classes.modalInner }}>
              {currentTab === 0 && (
                <>
                  <FormGroup>
                    <FormControl disabled={action !== 'create'}>
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
                        disabled={this.state.socialPlane !== 1}
                        control={
                          <Checkbox
                            checked={this.state.pageSettings.allowView}
                            onChange={this.handleCheckbox('allowView')}
                            color="primary"
                          />
                        }
                        label="Allow others to view"
                      />
                      <FormControlLabel
                        disabled={
                          this.state.socialPlane !== 1 ||
                          !this.state.pageSettings.allowView
                        }
                        control={
                          <Checkbox
                            checked={this.state.pageSettings.allowEdit}
                            onChange={this.handleCheckbox('allowEdit')}
                            color="primary"
                          />
                        }
                        label="Allow others to edit"
                      />
                    </FormGroup>
                  </FormGroup>
                  {isOwner && (
                    <FormGroup>
                      <Typography variant="h6">Page Settings</Typography>
                      <FormGroup row>
                        <FormControlLabel
                          disabled={this.state.pageSettings.hidden}
                          control={
                            <Checkbox
                              checked={this.state.pageSettings.readOnly}
                              onChange={this.handleCheckbox('readOnly')}
                              color="primary"
                            />
                          }
                          label="Read-Only"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.state.pageSettings.hidden}
                              onChange={this.handleCheckbox('hidden')}
                              color="primary"
                            />
                          }
                          label="Hidden"
                        />
                      </FormGroup>
                    </FormGroup>
                  )}
                </>
              )}
              {currentTab === 1 && (
                <ApiForm
                  categories={['Core', 'From the web']}
                  whiteList={[
                    'li-richText',
                    'ac-gallery',
                    'ac-brainstorm',
                    'ac-quiz',
                    'ac-ck-board',
                    'op-twitter',
                    'op-rss',
                    'op-hypothesis'
                  ]}
                  config={this.state.activityConfig?.config}
                  activityType={this.state.activityConfig?.activityType}
                  activityMapping={{
                    'li-richText': 'Core',
                    'ac-gallery': 'Core',
                    'ac-brainstorm': 'Core',
                    'ac-quiz': 'Core',
                    'ac-ck-board': 'Core',
                    'op-twitter': 'From the web',
                    'op-rss': 'From the web',
                    'op-hypothesis': 'From the web'
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
            {action === 'create' && (
              <IconButton
                className={classes.expander}
                onClick={() => this.setState({ expanded: !expanded })}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            <Button onClick={this.props.hideModal} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => this.handleSubmit()}
              color="primary"
              variant="contained"
              data-testid="create_button"
            >
              {action === 'create' ? 'Create' : 'Apply'}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(PageSettingsModal);
