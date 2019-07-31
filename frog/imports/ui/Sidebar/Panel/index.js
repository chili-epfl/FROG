// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  titleBar: {
    width: '100%',
    height: '32px',
    padding: theme.spacing(0, 1, 0, 1),

    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center'
  },
  title: {
    flexGrow: 1,
    color: grey[500]
  }
}));

type PanelPropsT = {
  title?: string,
  children?: React.Node | React.Node[]
};

/**
 * Encapsulate custom content with a title. Used with the
 * sidebar component
 */
export const Panel = (props: PanelPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      {props.title && (
        <div className={classes.titleBar}>
          <Typography className={classes.title} variant="overline">
            {props.title}
          </Typography>
        </div>
      )}
      {props.children && (
        <div className={classes.content}>{props.children}</div>
      )}
    </div>
  );
};
