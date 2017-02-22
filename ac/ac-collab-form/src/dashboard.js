import React, { Component } from 'react';
import { groupBy, map, some } from 'lodash';
import { colorRange as color, TimedComponent } from 'frog-utils';

const GroupView = ({ members, group }) => {
  const completed = some(members, x => x.completed);
  return (
    <div>
      <h2>Group {group} {completed ? '(completed)' : ''}</h2>
      {members.map(x => {
        const textcolor = completed ? 'blue' : color(x.updated_at);
        return (
          <li key={x.username}>
            {' '}<span style={{ color: textcolor }}>{x.username}</span>
          </li>
        );
      })}
    </div>
  );
};

const Dashboard = ({ logs, timeNow }) => {
  const groups = groupBy(logs, x => x.group);
  return (
    <div>
      {map(groups, (v, k) => (
        <GroupView members={v} group={k} key={k} timeNow={timeNow} />
      ))}
    </div>
  );
};

export default TimedComponent(Dashboard);
