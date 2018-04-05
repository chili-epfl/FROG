// @flow

import React from 'react';
import { Button } from 'react-bootstrap';

import { Highlight } from 'frog-utils';

export default ({
  activity,
  onSelect,
  onPreview,
  searchS,
  setDelete,
  setIdRemove
}: any) => (
  <div className="list-group-item">
    <div style={{ marginLeft: '35px', minHeight: '48px' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h5 style={{ fontWeight: 'bold' }}>
          <Highlight text={activity.title} searchStr={searchS} />
        </h5>
        <h5 style={{ fontStyle: 'italic' }}>
          <Highlight
            text={' ('.concat(activity.activity_type).concat(')')}
            searchStr={searchS}
          />
        </h5>
      </div>
      <div style={{ width: '87%' }}>
        <Highlight text={activity.description} searchStr={searchS} />
      </div>
      {activity.tags.map(tag => (
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
      value={activity.uuid}
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
    <Button
      value={activity.uuid}
      className="btn btn-danger"
      style={{
        position: 'absolute',
        left: '2px',
        top: '40px',
        width: '9%',
        height: '34px'
      }}
      onClick={() => {
        setIdRemove(activity.uuid);
        setDelete(true);
      }}
    >
      <span className="glyphicon glyphicon-remove" />
    </Button>
    <Button
      value={activity.uuid}
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
  </div>
);
