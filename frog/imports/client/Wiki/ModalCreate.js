// @flow

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CheckBox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  FormControlLabel
} from '@material-ui/core';
import { values, A, TextInput } from 'frog-utils';
import LI from '../LearningItem';
import { dataFn } from './index';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';

import { learningItemTypesObj } from '/imports/activityTypes';

const editableLIs = values(learningItemTypesObj).filter(
  x => (x.Editor && x.liDataStructure) || x.Creator
);

export default ({ onCreate, setModalOpen, errorDiv, wikiId }: Object) => {
  const [newTitle, setNewTitle] = React.useState('');
  const [liType, setLiType] = React.useState('');
  const [openCreator, setOpenCreator] = React.useState(false);
  const [li, setLI] = React.useState(null);
  const [config, setConfig] = React.useState({});
  const [p1, setP1] = React.useState(false);
  const LearningItem = LI;

  const canSubmit =
    (openCreator && !config.invalid) ||
    (!openCreator &&
      (learningItemTypesObj[liType || 'li-richText'].liDataStructure || li));

  return (
    <Dialog open onClose={() => setModalOpen(false)}>
      <DialogTitle>Add new page</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '600',
            height: '600'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: 'red' }}>{errorDiv}</div>
            <TextInput
              placeholder="New LI Title"
              value={newTitle}
              onChange={e => setNewTitle(e)}
              noBlur
              onSubmit={() => onCreate(newTitle, liType, li, config, p1)}
              focus
            />
            <FormControl variant="outlined">
              <InputLabel>Template</InputLabel>
              <Select
                value={liType}
                onChange={e => setLiType(e.target.value)}
                displayEmpty
                name="liType"
              >
                {editableLIs.map(x => (
                  <MenuItem key={x.id} value={x.id}>
                    {x.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Learning Item type</FormHelperText>
              <FormControlLabel
                control={
                  <CheckBox
                    checked={p1}
                    onChange={() => setP1(!p1)}
                    color="primary"
                  />
                }
                label="Individual pages"
              />
            </FormControl>
            <A onClick={() => setOpenCreator(!openCreator)}>
              Use FROG activity type
            </A>
          </div>
          <div>
            {li && <LearningItem type="view" dataFn={dataFn} id={li} />}
            {!learningItemTypesObj[liType || 'li-richText'].liDataStructure && (
              <LearningItem
                type="create"
                dataFn={dataFn}
                meta={{
                  wikiId,
                  title: newTitle
                }}
                liType={liType}
                onCreate={lix => {
                  setLI(lix);
                  onCreate(newTitle, liType, lix, {}, p1);
                }}
              />
            )}
            {openCreator && (
              <ApiForm noOffset showDelete onConfigChange={e => setConfig(e)} />
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        {canSubmit && (
          <Button
            color="secondary"
            onClick={() => onCreate(newTitle, liType, li, config, p1)}
          >
            CREATE
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
