// @flow

import React from 'react';

const StudentList = ({ students }: { students: Array<Object> }) => (
  <div style={{ display: 'flex' }}>
    <div>
      <h3>Active students</h3>
    </div>
    <div style={{ marginLeft: '50px', alignSelf: 'center' }}>
      <table>
        <tbody>
          <tr>
            <td>Online and idle</td>
            <td>
              {
                students.filter(
                  x => x.status && x.status.online && x.status.idle
                ).length
              }
            </td>
          </tr>
          <tr>
            <td>Online and active </td>
            <td>
              {
                students.filter(
                  x => x.status && x.status.online && !x.status.idle
                ).length
              }
            </td>
          </tr>
          <tr>
            <td style={{ paddingRight: '10px' }}>All students in session</td>
            <td>{students.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default StudentList;
