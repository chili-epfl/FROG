// @flow

import React from 'react';
import { Button } from 'react-bootstrap';

import { Highlight } from 'frog-utils';

export default ({
  object,
  onSelect,
  onPreview,
  searchStr,
  setDelete,
  setIdRemove
}: any) => (
  <div className="bootstrap">
    <div className="list-group-item">
      <div style={{ marginLeft: '35px', minHeight: '48px' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h5 style={{ fontWeight: 'bold' }}>
            <Highlight text={object.title} searchStr={searchStr} />
          </h5>
          {object.activity_type && (
            <h5 style={{ fontStyle: 'italic' }}>
              <Highlight
                text={`(${object.activity_type})`}
                searchStr={searchStr}
              />
            </h5>
          )}
        </div>
        <div style={{ width: '87%' }}>
          <Highlight text={object.description} searchStr={searchStr} />
        </div>
        {object.tags.map(tag => (
          <span
            className="label label-info"
            key={tag}
            style={{ marginLeft: '2px', border: '1px solid grey' }}
          >
            {tag}
          </span>
        ))}
      </div>
      <Button
        value={object.uuid}
        className="glyphicon glyphicon-ok"
        style={{
          position: 'absolute',
          left: '2px',
          top: '4px',
          width: '9%',
          minWidth: '40px',
          height: '34px'
        }}
        onClick={onSelect}
      />
      <Button
        value={object.uuid}
        className="btn btn-danger"
        style={{
          position: 'absolute',
          left: '2px',
          top: '40px',
          minWidth: '40px',
          width: '9%',
          height: '34px'
        }}
        onClick={() => {
          setIdRemove(object.uuid);
          setDelete(true);
        }}
      >
        <span className="glyphicon glyphicon-remove" />
      </Button>
      {object.activity_type && (
        <Button
          value={object.uuid}
          className="glyphicon glyphicon-eye-open"
          style={{
            position: 'absolute',
            right: '2px',
            top: '5px',
            width: '10%',
            height: '34px'
          }}
          onClick={onPreview}
        />
      )}
    </div>
  </div>
);
