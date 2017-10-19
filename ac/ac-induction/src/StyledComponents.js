// @flow

import styled from 'styled-components';

export const Main = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 42px;
`;

export const NavLi = styled.li`
  text-align: center;
`;

export const PresButton = styled.button`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 50px;
`;

export const ExMain = styled.div`
  height: 100%;
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
