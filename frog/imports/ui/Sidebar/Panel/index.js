// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { Row } from '../Row';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    paddingTop: theme.spacing(2)
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
  return (
    <div className={classes.root}>
      {props.title && <Row text={props.title} variant="header" />}
      {props.children && (
        <div className={classes.content}>{props.children}</div>
      )}
    </div>
  );
};
