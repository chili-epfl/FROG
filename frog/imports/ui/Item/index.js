// @flow

import * as React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { RowButton } from '../RowItems';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '250px',
    border: '1px solid #EAEAEA',
    borderRadius: theme.shape.borderRadius,
    background: 'white',
    overflow: 'hidden',
    cursor: 'pointer',

    display: 'grid',
    gridTemplateRows: '1fr 48px'
  },
  infoBar: {
    borderTop: '1px solid #EAEAEA'
  }
}));

type ItemProps = {
  image?: React.Element<*>,
  icon?: React.Element<*>,
  rightIcon?: React.Element<*>,
  children?: string
};

export const Item = (props: ItemProps) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div />
      <div className={classes.infoBar}>
        <RowButton size="large" icon={props.icon} rightIcon={props.rightIcon}>
          {props.children}
        </RowButton>
      </div>
    </div>
  );
};
