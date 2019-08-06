// @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';
import { Fab, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import { Highlight } from '/imports/frog-utils';
import { getUsername } from '/imports/api/users';

const styles = {
  iconButtonRoot: {
    height: '25px',
    width: '25px'
  },
  iconRoot: {
    width: '0.8em',
    height: '0.8em'
  },
  iconRootDelete: {
    width: '0.8em',
    height: '0.8em',
    color: '#FF6666'
  },
  secondaryText: {
    color: 'rgba(0, 0, 0, 0.54)'
  }
};

const ListItems = ({
  classes,
  object,
  showExpanded,
  onSelect,
  expand,
  hasPreview,
  onPreview,
  isLibrary,
  setDelete,
  setIdRemove,
  searchS
}: any) => (
  <ListItem button value={object.id} onClick={onSelect}>
    <Grid container>
      <Grid item xs={12}>
        <Typography className="listitem" variant="subtitle1" gutterBottom>
          <Highlight
            text={
              object.meta.name +
              ' (' +
              (object.meta.category || 'No category') +
              ')'
            }
            searchStr={searchS}
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom className={classes.secondaryText}>
          <Highlight
            text={
              (object.meta.activityTypeName
                ? object.meta.activityTypeName + ': '
                : '') + (object.meta.shortDesc || ' - ')
            }
            searchStr={searchS}
          />
        </Typography>
      </Grid>
      {isLibrary ? (
        <div>
          <Grid item xs={12}>
            <Typography gutterBottom className={classes.secondaryText}>
              <Highlight
                text={'Owner: ' + (object.meta.owner_id || 'undefined')}
                searchStr={searchS}
              />
            </Typography>
          </Grid>
          {object.tags.map(x => (
            <Chip key={x} label={x} />
          ))}
        </div>
      ) : (
        showExpanded && (
          <Grid item xs={12}>
            <Typography
              variant="caption"
              gutterBottom
              className={classes.secondaryText}
            >
              <i>
                <Highlight text={object.meta.description} searchStr={searchS} />
              </i>
            </Typography>
          </Grid>
        )
      )}
    </Grid>
    <ListItemSecondaryAction>
      <Grid container direction="column" justify="center">
        <Grid item xs={6}>
          {hasPreview && (
            <IconButton
              value={object.id}
              aria-label="Preview"
              onClick={onPreview}
              classes={{
                root: classes.iconButtonRoot
              }}
            >
              <RemoveRedEye
                classes={{
                  root: classes.iconRoot
                }}
              />
            </IconButton>
          )}
        </Grid>
        <Grid item xs={6}>
          {isLibrary
            ? setDelete && (
                <Fab
                  aria-label="Delete"
                  color="secondary"
                  disabled={getUsername() !== object.owner_id}
                  onClick={() => {
                    setIdRemove({ type: 'activity', id: object.id });
                    setDelete(true);
                  }}
                  classes={{
                    root: classes.iconButtonRoot
                  }}
                >
                  <DeleteIcon />
                </Fab>
              )
            : !showExpanded && (
                <IconButton
                  value={object.id}
                  aria-label="Preview"
                  onClick={expand}
                  classes={{
                    root: classes.iconButtonRoot
                  }}
                >
                  <ExpandMore
                    classes={{
                      root: classes.iconRoot
                    }}
                  />
                </IconButton>
              )}
        </Grid>
      </Grid>
    </ListItemSecondaryAction>
  </ListItem>
);

export default withStyles(styles)(ListItems);
