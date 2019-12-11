import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { Logo } from '/imports/ui/Logo';

const useStyle = makeStyles(theme => ({
  root: {
    height: theme.spacing(8),
    background: '#FFF',
    display: 'flex',
    alignItems: 'center',
    width: `calc(100% - ${2 * theme.spacing(4)})`,
    padding: theme.spacing(0, 4),
    margin: '0',
    boxShadow: '0px 5px 10px rgba(0,0,0,.025)'
  }
}));

export const Header = () => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <Logo />
    </div>
  );
};
