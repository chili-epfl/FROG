// @flow

import React from 'react';
import { Button } from 'react-bootstrap';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import DeleteIcon from '@material-ui/icons/Delete';

import { Highlight } from 'frog-utils';

export default ({
  object,
  showExpanded,
  onSelect,
  expand,
  hasPreview,
  onPreview,
  searchS
}: any) => (
  <div className="list-group-item">
    <div style={{ cursor: 'pointer' }} onClick={onSelect}>
      <List>
        <ListItem>
          <ListItemText
            secondary={
              <Highlight text={object.meta.shortDesc} searchStr={searchS} />
            }
          >
            <Highlight text={object.meta.name} searchStr={searchS} />
          </ListItemText>

          <ListItemSecondaryAction>
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
      </List>
      {/* {showExpanded && (
        <div style={{ width: '87%' }}>
          <i>
            <Highlight text={object.meta.description} searchStr={searchS} />
          </i>
        </div>
      )}
    </div>
    <Button value={object.id} onClick={onSelect}>
      Ok
    </Button>
    {!showExpanded && <Button onClick={expand}>Menu-Down</Button>}

    {hasPreview && (
      <Button value={object.id} onClick={onPreview}>
        Eye
      </Button>
    )} */}
    </div>
  </div>
);
