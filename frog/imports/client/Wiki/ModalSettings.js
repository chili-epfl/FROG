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
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/styles';

import { Modal } from './components/Modal';
import { type WikiSettingsT } from './index';

type ModalSettingsPropsT = {
  callback: WikiSettingsT => void,
  hideModal: () => void,
  currentSettings: WikiSettingsT,
  classes: Object
};

const styles = {
  group: {
    margin: '1vh'
  },
  divider: {
    margin: '2vh'
  },
  label: {
    paddingTop: '2vh'
  },
  helperText: {
    display: 'inline',
    paddingLeft: '1vw',
    fontSize: '1rem',
    letterSpacing: '0.001em'
  },
  select: {
    margin: '1vh'
  }
};

export default withStyles(styles)(
  ({ callback, hideModal, currentSettings, classes }: ModalSettingsPropsT) => {
    const [settings, setSettings] = useState(currentSettings);
    const handleChange = target => name => event => {
      setSettings({ ...settings, [name]: event.target[target] });
    };
    return (
      <Modal
        title="Change Wiki Settings"
        actions={[
          { title: 'Cancel', callback: hideModal },
          {
            title: 'Apply',
            callback: () => callback(settings)
          }
        ]}
      >
        <FormGroup className={classes.group}>
          <FormControlLabel
            checked={settings.locked}
            control={<Switch color="secondary" />}
            onChange={handleChange('checked')('locked')}
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
            onChange={handleChange('checked')('readOnly')}
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
              setSettings({ ...settings, allowPageCreation: !e.target.checked })
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
        <Divider />
        <FormGroup>
          <InputLabel htmlFor="access" className={classes.label}>
            Password Required
          </InputLabel>
          <Select
            value={settings.restrict}
            onChange={handleChange('value')('restrict')}
            inputProps={{
              name: 'restrict',
              id: 'access'
            }}
            className={classes.select}
          >
            <MenuItem value="none">None / Anyone can view and edit</MenuItem>
            <MenuItem value="edit">For Editing</MenuItem>
            <MenuItem value="view">For Viewing</MenuItem>
          </Select>
          <InputLabel htmlFor="password" className={classes.label}>
            Password
          </InputLabel>
          <TextField
            margin="normal"
            onChange={handleChange('value')('password')}
            defaultValue={settings.password}
            disabled={settings.restrict === 'none'}
            className={classes.select}
          />
        </FormGroup>
      </Modal>
    );
  }
);
