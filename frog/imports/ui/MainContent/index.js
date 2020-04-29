// @flow
import * as React from 'react';
import Grid from '@material-ui/core/Grid';

type MainContentPropsT = {
  title?: string,
  action?: string,
  callback?: () => void,
  children: React.Node | React.Node[]
};

export const MainContent = ({ children }: MainContentPropsT) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
};
