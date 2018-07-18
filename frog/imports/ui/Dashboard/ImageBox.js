// @flow

import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: theme.mixins.gutters({
    marginLeft: 20,
    paddingTop: 36,
    paddingBottom: 16
  })
});

const ImgButton = styled.button`
  position: relative;
  border: none;
  background: none;
  max-width: 250px;
  height: 250px;
  width: 100%;
  margin: 5px;
  padding: 0px;
  flex: 0 1 auto;
`;

export const CenteredImg = styled.div`
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 5%;
`;

const ImageBox = ({
  children,
  onClick,
  classes
}: {
  onClick: Function,
  children: any,
  classes: any
}) => (
  <ImgButton onClick={onClick}>
    <Paper elevation={24} className={classes.root}>
      {children}
    </Paper>
  </ImgButton>
);
ImageBox.displayName = 'ImageBox';
export default withStyles(styles)(ImageBox);
