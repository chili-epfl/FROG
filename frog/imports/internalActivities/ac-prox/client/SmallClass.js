import * as React from 'react';
import { A } from '/imports/frog-utils';
import { isEmpty } from 'lodash';

const Runner = ({
  activityData: { config },
  logger,
  data,
  dataFn,
  userInfo: { id, name }
}) => {
  const addGroup = () => {
    const groups = Object.keys(data.groups);
    const newNumber = isEmpty(groups)
      ? 1
      : parseInt(groups.sort().slice(-1)[0], 10) + 1;
    const groupName = '' + newNumber;
    logger({ type: 'group.create', itemId: groupName });

    if (!data.studentInfo[id]) {
      dataFn.objInsert(name, ['studentInfo', id]);
    }
    dataFn.objInsert(id, ['groups', groupName]);
    dataFn.objInsert(groupName, ['students', id]);
  };

  const removeGroup = () => {
    const group = data.students[id];

    logger({ type: 'group.leave', itemId: group });
    dataFn.objDel(null, ['students', id]);
    const remainingStudents = Object.keys(data.students).filter(
      x => data.students[x] === group && x !== id
    );
    if (remainingStudents.length === 0) {
      dataFn.objDel(null, ['groups', group]);
    }
  };

  const onJoin = group => {
    if (!data.studentInfo[id]) {
      dataFn.objInsert(name, ['studentInfo', id]);
    }
    dataFn.objInsert(group, ['students', id]);
    logger({ type: 'group.join', itemId: group });
  };

  return data.students[id] ? (
    <div>
      You are in {data.students[id]}. <A onClick={removeGroup}>Leave group</A>
      <Group data={data} group={data.students[id]} />
    </div>
  ) : (
    <>
      {!config.maxGroups ||
      Object.keys(data.groups).length < config.maxGroups ? (
        <>
          <A onClick={addGroup}>Add group</A> or click on group header to join
          an existing group{' '}
        </>
      ) : (
        'Click on a group header to join an existing group '
      )}
      {config.maxStudentsInGroups &&
        `with less than ${config.maxStudentsInGroups} members`}
      {Object.keys(data.groups).map(group => (
        <Group
          data={data}
          group={group}
          key={group}
          onJoin={onJoin}
          max={config.maxStudentsInGroups}
        />
      ))}
    </>
  );
};

const Group = ({ data, group, onJoin, max }) => {
  const students = Object.keys(data.students).filter(
    x => data.students[x] === group
  );
  const moreSpace = !max || students.length < max;
  return (
    <div>
      <h2>
        {onJoin && moreSpace ? (
          <A onClick={() => onJoin(group)}>{group}</A>
        ) : (
          group
        )}
        {!moreSpace && ' (full)'}
      </h2>
      {students.map(x => (
        <li key={x}>{data.studentInfo[x]}</li>
      ))}
    </div>
  );
};

export default Runner;
