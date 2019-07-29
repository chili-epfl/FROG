// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import { Typography } from '@material-ui/core';
import { PanelButton } from './PanelButton';
import { MoreVert, Search } from '@material-ui/icons';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    borderBottom: `solid 1px ${grey[300]}`
  },
  titleBar: {
    width: '100%',
    height: '48px',
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

export const Panel = (props: PanelPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      {props.title && (
        <div className={classes.titleBar}>
          <Typography className={classes.title} variant="overline">
            {props.title}
          </Typography>
          <PanelButton icon={<Search />} />
          <PanelButton icon={<MoreVert />} />
        </div>
      )}
      {props.children && (
        <div className={classes.content}>{props.children}</div>
      )}
    </div>
  );
};
