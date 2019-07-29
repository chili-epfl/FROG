// @flow

import * as React from 'react';
import {
  IconButton,
  makeStyles,
  type IconButtonProps
} from '@material-ui/core';
import { PlayArrow, MoreVert } from '@material-ui/icons';
import grey from '@material-ui/core/colors/grey';

const useStyle = makeStyles(theme => ({
  root: {
    fontSize: '18px',
    color: grey[500],
    transition: 'all .2s',
    margin: theme.spacing(0, -1),
    '&:hover': {
      color: grey[700]
    }
  }
}));

export type PanelButtonPropsT = {
  icon: React.Element<IconButtonProps>,
  callback?: () => void
};

export const PanelButton = (props: PanelButtonPropsT) => {
  const classes = useStyle();
  return (
    <IconButton className={classes.root} onClick={props.callback}>
      {React.cloneElement(props.icon, { fontSize: 'inherit' })}
    </IconButton>
  );
};
