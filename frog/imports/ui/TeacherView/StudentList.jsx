// @flow

import React from 'react';

const StudentList = ({ students }: { students: Array<Object> }) =>
  <div style={{ display: 'flex' }}>
    <div>
      <h3>Registered students</h3>
    </div>
    <div style={{ marginLeft: '50px', alignSelf: 'center' }}>
      {students && students.length < 25
        ? <ul>
            {students.map(student =>
              <li key={student._id}>
                {student.username}
              </li>
            )}
          </ul>
        : students ? students.length : <p>NO STUDENTS</p>}
    </div>
  </div>;

export default StudentList;
