// @flow

import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    marginLeft: 20,
    paddingLeft: 16,
    paddingRight: 24,
    paddingTop: 20,
    paddingBottom: 16,
    width: '160px',
    height: '180px',
    overflow: 'hidden'
  }
});

const ImgButton = styled.button`
  position: relative;
  border: none;
  background: none;
  height: 250px;
  width: 180px;
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
  classes,
  color
}: {
  onClick: Function,
  children: any,
  classes: any,
  color?: string
}) => (
  <ImgButton onClick={onClick}>
    <Paper
      elevation={12}
      className={classes.root}
      style={{ backgroundColor: color }}
    >
      {children}
    </Paper>
  </ImgButton>
);
// style={getStyle(styleCode)}
ImageBox.displayName = 'ImageBox';
export default withStyles(styles)(ImageBox);
