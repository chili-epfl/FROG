// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { activityTypes } from '/imports/activityTypes';
import { templatesObj } from '/imports/internalTemplates';
import { type PropsT } from './types';
import { style } from './style';

// You can add the permitted activities for the single activity here
const allowed = [
  'ac-quiz',
  'ac-ck-board',
  'ac-chat',
  'ac-brainstorm',
  'ac-ranking',
  'ac-video'
];
const list = activityTypes.filter(x => allowed.includes(x.id));
list.push(templatesObj['te-peerReview']);

/**
 * The icon-based selection form for choosing the activity type
 * @param {Function} onSubmit - Callback function called with the selection by the user.
 */
function ChooseActivityType(
  props: {
    onSubmit: Function
  } & PropsT
) {
  const { classes, onSubmit } = props;
  return (
    <Card raised className={classes.card}>
      <Typography variant="h5" component="h2">
        Let's start by choosing an activity type
      </Typography>
      <GridList cols={4} spacing={8}>
        {list.map(x => (
          <GridListTile
            key={x.id}
            classes={{ root: classes.tile }}
            onClick={e => {
              onSubmit(x);
            }}
          >
            <img
              src={'/' + x.id + '.png'}
              alt={x.id}
              className={classes.icon}
            />
            <GridListTileBar
              title={x.meta.name}
              subtitle={x.meta.shortDesc}
              classes={{ root: classes.shortDesc }}
            />
          </GridListTile>
        ))}
      </GridList>
    </Card>
  );
}

export default withStyles(style)(ChooseActivityType);
