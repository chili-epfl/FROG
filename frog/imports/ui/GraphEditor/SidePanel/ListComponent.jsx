// @flow

import React from 'react';

import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemSecondaryAction } from 'material-ui/List';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Typography from 'material-ui/Typography';

import { Highlight } from 'frog-utils';

const styles = {
  iconButtonRoot: {
    height: '25px',
    width: '25px'
  },
  iconRoot: {
    width: '0.8em',
    height: '0.8em'
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
  searchS
}: any) => (
  <ListItem button value={object.id} onClick={onSelect}>
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="subheading" gutterBottom>
          <Highlight text={object.meta.name} searchStr={searchS} />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom className={classes.secondaryText}>
          <Highlight text={object.meta.shortDesc} searchStr={searchS} />
        </Typography>
      </Grid>
      {showExpanded && (
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
      )}
    </Grid>

    {/* <ListItemText
      secondary={<Highlight text={object.meta.shortDesc} searchStr={searchS} />}
    >
      
    </ListItemText> */}

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
          {!showExpanded && (
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
