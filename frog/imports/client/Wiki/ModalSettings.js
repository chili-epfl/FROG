// @flow

import React, { useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

import {
  type WikiSettingsT,
  PERM_ALLOW_EVERYTHING,
  PERM_PASSWORD_TO_EDIT,
  PERM_PASSWORD_TO_VIEW
} from '/imports/api/wikiTypes';

type ModalSettingsPropsT = {
  callback: WikiSettingsT => void,
  hideModal: () => void,
  currentSettings: WikiSettingsT,
  classes: Object
};

const styles = {
  group: {
    margin: 8
  },
  divider: {
    margin: '2%'
  },
  label: {
    paddingTop: '2%'
  },
  helperText: {
    display: 'inline',
    paddingLeft: '1%',
    fontSize: '1rem'
  },
  select: {
    margin: '1%'
  },
  tabs: {
    fontSize: 'inherit'
  },
  root: {
    width: '600px'
  },
  modalInner: {
    height: '20vh',
    padding: 16
  }
};

function ModalSettings({
  callback,
  hideModal,
  currentSettings,
  classes
}: ModalSettingsPropsT) {
  const [settings, setSettings] = useState(currentSettings);
  const [currentTab, changeTab] = useState(0);
  const [open, changeState] = useState(true);

  React.useEffect(() => {
    callback(settings);
  }, [settings.locked, settings.readOnly, settings.allowPageCreation]);

  return (
    <Dialog open={open}>
      <DialogTitle>Change Wiki Settings</DialogTitle>
      <div className={classes.root}>
        <Tabs
          value={currentTab}
          indicatorColor="secondary"
          onChange={(e: any, value: number) => changeTab(value)}
          variant="fullWidth"
        >
          <Tab label="Actions" className={classes.tabs} />
          <Tab label="Password" className={classes.tabs} />
        </Tabs>
        <DialogContent classes={{ root: classes.modalInner }}>
          {currentTab === 0 && (
            <FormGroup className={classes.group}>
              <FormControlLabel
                checked={settings.locked}
                control={<Switch color="secondary" />}
                onChange={e => {
                  setSettings({ ...settings, locked: e.target.checked });
                  callback(settings);
                }}
                label={
                  <>
                    <>Lock Wiki</>
                    <FormHelperText className={classes.helperText}>
                      Only the owners will be able to access the wiki
                    </FormHelperText>
                  </>
                }
                labelPlacement="end"
                className={classes.switch}
              />
              <FormControlLabel
                checked={settings.readOnly}
                control={<Switch color="secondary" />}
                onChange={e =>
                  setSettings({ ...settings, readOnly: e.target.checked })
                }
                label={
                  <>
                    <>Make the wiki read-only</>
                    <FormHelperText className={classes.helperText}>
                      Only the owners will be able to edit the wiki
                    </FormHelperText>
                  </>
                }
                labelPlacement="end"
              />
              <FormControlLabel
                checked={!settings.allowPageCreation}
                control={<Switch color="secondary" />}
                onChange={e =>
                  setSettings({
                    ...settings,
                    allowPageCreation: !e.target.checked
                  })
                }
                label={
                  <>
                    <>Prevent users from creating pages</>
                    <FormHelperText className={classes.helperText}>
                      Only the owners will be able to create pages
                    </FormHelperText>
                  </>
                }
                labelPlacement="end"
              />
            </FormGroup>
          )}
          {currentTab === 1 && (
            <FormGroup>
              <InputLabel htmlFor="access" className={classes.label}>
                Password Required
              </InputLabel>
              <Select
                value={settings.restrict}
                onChange={e =>
                  setSettings({ ...settings, restrict: e.target.value })
                }
                inputProps={{
                  name: 'restrict',
                  id: 'access'
                }}
                className={classes.select}
              >
                <MenuItem value={PERM_ALLOW_EVERYTHING}>
                  None / Anyone can view and edit
                </MenuItem>
                <MenuItem value={PERM_PASSWORD_TO_EDIT}>For Editing</MenuItem>
                <MenuItem value={PERM_PASSWORD_TO_VIEW}>For Viewing</MenuItem>
              </Select>
              <InputLabel htmlFor="password" className={classes.label}>
                Password
              </InputLabel>
              <TextField
                margin="normal"
                onChange={e =>
                  setSettings({ ...settings, password: e.target.value })
                }
                defaultValue={settings.password}
                disabled={settings.restrict === 'none'}
                className={classes.select}
              />
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              changeState(false);
              hideModal();
            }}
            color="primary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              callback(settings);
              hideModal();
            }}
            color="primary"
            variant="contained"
            disabled={currentTab !== 1}
          >
            Apply
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default withStyles(styles)(ModalSettings);
