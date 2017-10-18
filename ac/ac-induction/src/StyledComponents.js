// @flow

import styled from 'styled-components';

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

export const TestResponseHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
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
