// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const LogoSVG = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="32"
      height="32"
    >
      <rect width="32" height="32" rx="8" fill="#11DFAB" />
    </mask>
    <g mask="url(#mask0)">
      <rect width="32" height="18" fill="#11DFAB" />
      <rect y="14" width="32" height="10" fill="#26C9AC" />
      <rect y="24" width="32" height="5" fill="#37B9B7" />
      <rect y="29" width="32" height="3" fill="#44ABA6" />
    </g>
  </svg>
);

const useStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    marginRight: theme.spacing(1)
  },
  text: {
    marginLeft: theme.spacing(1),
    fontSize: '24px',
    color: '#31BFAE',
    fontWeight: 700,
    lineHeight: 1
  }
}));

export const Logo = () => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <LogoSVG />
      <Typography className={classes.text} variant="subtitle1">
        FROG
      </Typography>
    </div>
  );
};
