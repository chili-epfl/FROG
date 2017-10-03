// @flow

import React from 'react';

const StudentList = ({ presences }: { students: Array<Object> }) =>
  <div style={{ display: 'flex' }}>
    <div>
      <h3>Active students</h3>
    </div>
    <div style={{ marginLeft: '50px', alignSelf: 'center' }}>
      {presences}
    </div>
  </div>;

export default StudentList;
