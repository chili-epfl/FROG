// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    paddingTop: theme.spacing(1),

    '&:last-child': {
      paddingBottom: theme.spacing(1)
    }
  }
}));

type PanelPropsT = {
  title?: string,
  children?: React.Element<*> | React.Element<*>[]
};

/**
 * Encapsulate custom content with a title. Used with the
 * sidebar component
 */
export const Panel = (props: PanelPropsT) => {
  const classes = useStyle();
  return <div className={classes.root}>{props.children}</div>;
};
