// @flow

import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { activityTypes } from '/imports/activityTypes';
import { type PropsT } from './types';

/**
 * The icon-based selection form for choosing the activity type
 * @param {Function} onSubmit - Callback function called with the selection by the user.
 */
export default function ChooseActivityType(
  props: {
    onSubmit: Function
  } & PropsT
) {
  const { classes, onSubmit } = props;
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
  return (
    <Card raised className={classes.card}>
      <Typography variant="h5" component="h2">
        Let's start by choosing an activity type
      </Typography>
      <GridList cols="4" spacing="8">
        {list.map(x => (
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              onSubmit(x);
            }}
          >
            <GridListTile key={x.id} classes={{ root: classes.tile }}>
              <img
                src={'/' + x.id + '.png'}
                alt={x.id}
                className={classes.icon}
              />
              <GridListTileBar
                title={x.meta.name}
                subtitle={<span>{x.meta.shortDesc}</span>}
                classes={{ root: classes.shortDesc }}
              />
            </GridListTile>
          </a>
        ))}
      </GridList>
    </Card>
  );
}
