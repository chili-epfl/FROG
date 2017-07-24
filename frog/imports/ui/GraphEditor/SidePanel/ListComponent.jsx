// @flow

import React from 'react';
import { Button } from 'react-bootstrap';

export default ({ object, showExpanded, onSelect, expand, onPreview }) =>
  <div className="list-group-item">
    <div style={{ marginLeft: '35px' }}>
      <h5 style={{ fontWeight: 'bold' }}>
        {object.meta.name}
      </h5>
      <div style={{ width: '87%' }}>
        {object.meta.shortDesc}
      </div>
      {showExpanded &&
        <div style={{ width: '87%' }}>
          <i>
            {object.meta.description}
          </i>
        </div>}
    </div>
    <Button
      value={object.id}
      className="glyphicon glyphicon-ok"
      style={{
        position: 'absolute',
        left: '2px',
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
          top: '4px',
          width: '9%',
          height: '35px'
        }}
        className="glyphicon glyphicon-menu-down"
        onClick={expand}
      />}

    <Button
      value={object.id}
      className="glyphicon glyphicon-eye-open"
      style={{
        position: 'absolute',
        right: '2px',
        top: '39px',
        width: '9%',
        height: '34px'
      }}
      onClick={onPreview}
    />
  </div>;
