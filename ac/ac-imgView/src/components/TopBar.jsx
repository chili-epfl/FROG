// @flow

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';

const Main = styled.div`
  position: absolute;
  height: 45px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
`;

const TopBar = ({ categories, category, setCategory, setZoom }: Object) =>
  <Main>
    {Object.keys(categories) > 2 &&
      <div>
        {category !== 'categories' &&
          <button
            className="btn btn-secondary"
            onClick={() => setCategory('categories')}
            style={{ margin: '5px' }}
          >
            <span className="glyphicon glyphicon-arrow-left" />{' '}
          </button>}
        <span style={{ margin: '5px', fontSize: 'large' }}>Library :</span>
        <DropdownButton title={category} id="dropdown-basic-0">
          {categories.filter(x => x !== category).map(y =>
            <MenuItem
              key={y}
              eventKey={'toto'}
              onClick={() => {
                setZoom(false);
                setCategory(y);
              }}
            >
              {y}
            </MenuItem>
          )}
        </DropdownButton>
      </div>}
    {category !== 'categories' &&
      <i style={{ marginLeft: '20px' }}>
        Hold shift while clicking to select a picture :
      </i>}
  </Main>;

export default TopBar;
