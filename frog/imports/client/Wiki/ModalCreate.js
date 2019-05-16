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
import { values, A } from 'frog-utils';
import LI from '../LearningItem';
import { dataFn } from './index';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import OperatorForm from '../GraphEditor/SidePanel/OperatorForm';
import { learningItemTypesObj } from '/imports/activityTypes';
import type { OperatorDbT } from 'frog-utils';

const editableLIs = values(learningItemTypesObj).filter(
  x => (x.Editor && x.liDataStructure) || x.Creator
);

type StateT = {
  currentTab: number,
  pageTitle: string,
  pageTitleValid: boolean,
  socialPlane: string,
  open: boolean,
  expanded: boolean,
  allowView: boolean,
  allowEdit: boolean,
  config: Object
};

type PropsT = {
  classes: Object,
  onCreate: Function,
  setModalOpen: Function,
  errorDiv: any,
  wikiId: string
};

const styles = () => ({
  formControl: {
    margin: 8
  },
  selectSocialPlane: {
    width: '7vw'
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
      socialPlane: 'everyone',
      allowView: true,
      allowEdit: true,
      config: {}
    };
  }

  handleTitleChange = (e: any) => {
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
    this.setState({ config: conf });
  };

  render() {
    const { currentTab, socialPlane, expanded, pageTitle } = this.state;
    const { classes } = this.props;
    return (
      <Dialog
        open={this.state.open}
        onClose={() => this.props.setModalOpen(false)}
        scroll="paper"
      >
        <FormGroup>
          <FormControl className={classes.formControl}>
            <Typography variant="title">Create New Page</Typography>
            <TextField
              autoFocus
              id="page-title"
              value={this.state.pageTitle}
              onChange={this.handleTitleChange}
              label="Page Title"
              margin="normal"
            />
          </FormControl>
        </FormGroup>
        <Collapse in={expanded} timeout="auto">
          <AppBar position="static">
            <Tabs
              value={this.state.currentTab}
              indicatorColor="secondary"
              textColor="#fff"
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
                  <Typography variant="title">Social Plane</Typography>
                  <Select
                    value={this.state.socialPlane}
                    onChange={this.handleSocialPlaneChange}
                    id="social-plane"
                    className={classes.selectSocialPlane}
                  >
                    <MenuItem value="everyone">Everyone</MenuItem>
                    <MenuItem value="group">Each Group</MenuItem>
                    <MenuItem value="individual">Each Individual</MenuItem>
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
                noOffset
                showDelete
                onConfigChange={e => this.handleConfig(e)}
              />
            )}
            {currentTab === 2 && <OperatorForm operatorType="product" />}
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
            onClick={() => this.props.setModalOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              this.props.onCreate(
                pageTitle,
                this.state.config === {} ? 'li-richText' : '',
                null,
                this.state.config
              )
            }
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
