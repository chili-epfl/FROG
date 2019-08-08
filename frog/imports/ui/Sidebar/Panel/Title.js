// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    padding: theme.spacing(0, 2),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'start',
    color: '#888'
  },
  text: {
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1,
    textTransform: 'uppercase'
  }
}));

type TitleProps = {
  size?: 'large' | 'default',
  text: string
};

export const Title = (props: TitleProps) => {
  const classes = useStyle();
  return (
    <div
      className={classes.root}
      style={{
        height: props.size === 'large' ? '48px' : '32px'
      }}
    >
      <Typography className={classes.text} variant="body1">
        {props.text}
      </Typography>
    </div>
  );
};
