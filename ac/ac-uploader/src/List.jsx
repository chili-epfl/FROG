// @flow

import React from 'react';
import styled from 'styled-components';

export default ({ data, dataFn }: Object) =>
  <Main>
    {Object.keys(data).map(x =>
      <div key={data[x].url} style={{ width: '240px', height: '300px' }}>
        <iframe
          title="IFrame"
          src={data[x].url}
          style={{ width: '220px', height: '260px' }}
        />
        <ButtonStyled
          className="btn btn-danger"
          onClick={() => dataFn.objDel(data[x], x)}
        >
          <span className="glyphicon glyphicon-remove" />
        </ButtonStyled>
      </div>
    )}
  </Main>;

const Main = styled.div`
  position: absolute;
  left: 5%;
  width: 90%;
  top: 200px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const ButtonStyled = styled.button`
  position: absolute;
  border-radius: 100px;
  transform: translate(-60%, -50%);
`;
