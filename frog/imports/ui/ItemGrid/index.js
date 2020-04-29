// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',

    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gridGap: theme.spacing(1)
  }
}));

type ItemGridProps<T> = {
  items: T[],
  mapItem: (item: T) => React.Element<*>
};

export const ItemGrid = <T>(props: ItemGridProps<T>) => {
  const classes = useStyle();

  return <div className={classes.root}>{props.items.map(props.mapItem)}</div>;
};
