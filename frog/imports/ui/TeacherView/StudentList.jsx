// @flow

import React from 'react';

export default ({ students }: { students: Array<Object> }) =>
  <div>
    <h3>Registered students</h3>
    {students && students.length
      ? <ul>
          {students.map(student =>
            <li key={student._id}>{student.username}</li>
          )}
        </ul>
      : <p>NO STUDENTS</p>}
  </div>;
