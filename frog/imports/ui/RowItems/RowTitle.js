// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '32px',
    padding: theme.spacing(0, 2),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'start',
    color: '#888',
    userSelect: 'none'
  },
  text: {
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1,
    textTransform: 'uppercase'
  }
}));

type RowTitleProps = {
  children: string
};

export const RowTitle = (props: RowTitleProps) => {
  const classes = useStyle();
  return (
    <div className={classes.root} onClick={e => e.stopPropagation()}>
      <Typography className={classes.text} variant="body1">
        {props.children}
      </Typography>
    </div>
  );
};
