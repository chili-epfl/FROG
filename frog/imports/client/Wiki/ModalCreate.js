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
  Input,
  InputLabel,
  Checkbox
} from '@material-ui/core';
import { values, A } from 'frog-utils';
import LI from '../LearningItem';
import { dataFn } from './index';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import { learningItemTypesObj } from '/imports/activityTypes';

const editableLIs = values(learningItemTypesObj).filter(
  x => (x.Editor && x.liDataStructure) || x.Creator
);

type StateT = {
  currentTab: number,
  pageTitle: string,
  pageTitleValid: boolean,
  socialPlane: string,
  open: boolean,
  allowView: boolean,
  allowEdit: boolean
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
    height: '50vh'
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
      socialPlane: 'everyone',
      allowView: true,
      allowEdit: true
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

  render() {
    const { currentTab, socialPlane } = this.state;
    const { classes } = this.props;

    return (
      <Dialog
        open={this.state.open}
        onClose={() => this.props.setModalOpen(false)}
        scroll="paper"
        classes={{ paper: classes.modalInner }}
      >
        <Tabs
          value={this.state.currentTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleTabs}
          variant="fullWidth"
        >
          <Tab label="Settings" />
          <Tab label="Component" />
          <Tab label="Operator" />
        </Tabs>
        <DialogContent>
          {currentTab === 0 && (
            <FormGroup>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="page-title">Page Title</InputLabel>
                <Input
                  id="page-title"
                  value={this.state.pageTitle}
                  onChange={this.handleTitleChange}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="social-plane">Social Plane</InputLabel>
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
              <FormControlLabel
                className={classes.formControl}
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
                className={classes.formControl}
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
          )}
          {currentTab === 1 && (
            <ApiForm noOffset showDelete onConfigChange={e => setConfig(e)} />
          )}
          {currentTab === 2 && <>WIP</>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.props.setModalOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={this.props.onCreate} color="primary" autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(NewPageModal);
