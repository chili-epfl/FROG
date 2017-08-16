// @flow

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

const TopBar = ({
  categories,
  categorySelected,
  setCategorySelected,
  setCategoryView
}: Object) =>
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      paddingTop: '1%',
      paddingLeft: '50%'
    }}
  >
    <button onClick={() => setCategoryView(true)}><span className='glyphicon glyphicon-arrow-left' /> </button>
    <div>Library :</div> <div style={{ width: '10px' }} />
    <DropdownButton title={categorySelected} id="dropdown-basic-0">
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
  </div>;

export default TopBar;
