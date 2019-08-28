// @flow

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';
import { HTML } from '/imports/frog-utils';

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
  setCategory,
  setZoom,
  hideCategory,
  guidelines
}: Object) =>
  !hideCategory && Object.keys(categories).length > 2 ? (
    <div className="bootstrap">
      <Main>
        <p style={{ fontSize: '22px' }}>{guidelines}</p>
        <Body>
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
            <DropdownButton title="Categories" id="dropdown-basic-0">
              {categories
                .filter(x => x !== category)
                .map(y => (
                  <MenuItem
                    key={y}
                    eventKey="toto"
                    onClick={() => {
                      setZoom(false);
                      setCategory(y);
                    }}
                  >
                    <HTML html={y} />
                  </MenuItem>
                ))}
            </DropdownButton>
          </div>
        </Body>
      </Main>
    </div>
  ) : null;

TopBar.displayName = 'TopBar';
export default TopBar;
