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
import CheckCircle from '@material-ui/icons/CheckCircle';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';

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
  <List>
    <ListItem button value={object.id} onClick={onSelect}>
      <ListItemText
        secondary={
          <Highlight text={object.meta.shortDesc} searchStr={searchS} />
        }
      >
        <Highlight text={object.meta.name} searchStr={searchS} />
      </ListItemText>

      <ListItemSecondaryAction>
        {hasPreview && (
          <IconButton
            value={object.id}
            aria-label="Preview"
            onClick={onPreview}
          >
            <RemoveRedEye />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);
