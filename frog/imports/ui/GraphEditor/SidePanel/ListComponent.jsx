// @flow

import React from 'react';
import { Button } from 'react-bootstrap';

export default ({ object, showExpanded, onSelect, expand }) =>
  <div className="list-group-item">
    <h5 style={{ fontWeight: 'bold' }}>
      {object.meta.name}
    </h5>
    <Button
      value={object.id}
      className="glyphicon glyphicon-ok"
      style={{
        position: 'absolute',
        right: '2px',
        top: '4px',
        width: '9%',
        height: '34px'
      }}
      onClick={onSelect}
    />
    {!showExpanded &&
      <Button
        style={{
          position: 'absolute',
          right: '2px',
          top: '39px',
          width: '9%',
          height: '35px'
        }}
        className="glyphicon glyphicon-menu-down"
        onClick={expand}
      />}
    <div style={{ width: '87%' }}>
      {object.meta.shortDesc}
    </div>
    {showExpanded &&
      <div style={{ width: '87%' }}>
        <i>
          {object.meta.description}
        </i>
      </div>}
  </div>;
