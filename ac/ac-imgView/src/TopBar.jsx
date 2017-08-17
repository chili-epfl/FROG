// @flow

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';

const Main = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 1%;
  padding-left: 50%;
`;

const TopBar = ({
  categories,
  categorySelected,
  setCategorySelected
}: Object) =>
  <Main>
    {categorySelected !== 'categories' &&
      <button
        className="btn btn-secondary"
        onClick={() => setCategorySelected('categories')}
        style={{ marginRight: '10px', transform: 'translateY(-20%)' }}
      >
        <span className="glyphicon glyphicon-arrow-left" />{' '}
      </button>}
    <div style={{ width: '60px' }}>Library :</div>{' '}
    <div style={{ width: '10px' }} />
    <DropdownButton
      title={categorySelected}
      id="dropdown-basic-0"
      style={{ transform: 'translateY(-20%)' }}
    >
      {categories.filter(x => x !== categorySelected).map(y =>
        <MenuItem
          key={y}
          eventKey={'toto'}
          onClick={() => setCategorySelected(y)}
        >
          {y}
        </MenuItem>
      )}
    </DropdownButton>
  </Main>;

export default TopBar;
