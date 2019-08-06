// @flow

import * as React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '250px 1fr'
  }
}));

type BaseLayoutProps = {
  children: React.Element<*>[]
};

export const BaseLayout = (props: BaseLayoutProps) => {
  const classes = useStyle();
  return <div className={classes.root}>{props.children}</div>;
};
