// @flow

import React from 'react';
import styled from 'styled-components';

import CenteredImg from './CenteredImg';

const getStyle = styleCode =>
  ({
    chosen_by_team: {
      border: 'solid 4px #009900',
      borderRadius: '5px'
    },
    chosen_partially: {
      border: 'solid 4px #FFFF00',
      borderRadius: '5px'
    }
  }[styleCode] || { border: 'solid 2px #a0a0a0' });

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

const ImageBox = ({
  image,
  onClick,
  styleCode
}: {
  image: Object,
  onClick: Function,
  styleCode: string
}) =>
  <ImgButton onClick={onClick} style={getStyle(styleCode)}>
    <CenteredImg url={image.url} />
  </ImgButton>;

ImageBox.displayName = 'ImageBox';
export default ImageBox;
