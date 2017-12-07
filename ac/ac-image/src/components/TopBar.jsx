// @flow

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';

const Main = styled.div`
  height: 90px;
  justify-content: center;
  align-items: center;
`;

const Body = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const TopBar = ({
  categories,
  category,
  canVote,
  setCategory,
  setZoom,
  hideCategory,
  guidelines
}: Object) => (
  <Main>
    <p style={{ fontSize: '22px' }}>{guidelines}</p>
    <Body>
      {!hideCategory &&
        Object.keys(categories).length > 2 && (
          <div>
            {category !== 'categories' && (
              <button
                className="btn btn-secondary"
                onClick={() => setCategory('categories')}
                style={{ margin: '5px' }}
              >
                <span className="glyphicon glyphicon-arrow-left" />{' '}
              </button>
            )}
            <span style={{ margin: '5px', fontSize: 'large' }}>Library :</span>
            <DropdownButton title={category} id="dropdown-basic-0">
              {categories.filter(x => x !== category).map(y => (
                <MenuItem
                  key={y}
                  eventKey="toto"
                  onClick={() => {
                    setZoom(false);
                    setCategory(y);
                  }}
                >
                  {y}
                </MenuItem>
              ))}
            </DropdownButton>
          </div>
        )}
      {category !== 'categories' &&
        canVote && (
          <i style={{ marginLeft: '20px' }}>
            Hold shift while clicking to select a picture :
          </i>
        )}
    </Body>
  </Main>
);

TopBar.displayName = 'TopBar';
export default TopBar;
