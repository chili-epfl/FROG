// @flow
import React from 'react';
import styled from 'styled-components';
import { ImageReload } from 'frog-utils';

export const Main = styled.div`
  height: 100%;
  width: 100%;
`;

export const NavLi = styled.li`
  text-align: center;
  min-width: fit-content;
`;

export const PresButton = styled.button`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 50px;
`;

export const ExMain = styled.div`
  height: 95%;
  display: flex;
  flex-direction: row;
`;

export const ExContainer = styled.div`
  width: 50%;
  height: 100%;
  text-align: center;
`;

export const ExLine = styled.div`
  width: 2px;
  height: 100%;
  background-color: black;
`;

export const ExButton = styled.div`
  position: absolute;
  bottom: 50px;
  width: 150px;
`;

export const TestCorrectionDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TestCorrectionCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;

export const TestListDiv = styled.div`
  width: 100%;
  height: fit-content;
  text-align: left;
  padding-left: 100px;
`;

export const DefinitionBox = styled.div`
  font-size: x-large;
  border: 2px solid;
  border-radius: 5px;
  background: aliceblue;
  padding: 15px;
  max-width: 600px;
  margin: auto;
`;

export const Img = (props: Object) => (
  <ImageReload
    {...props}
    style={{
      maxWidth: '100%',
      maxHeight: '100%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
  />
);
