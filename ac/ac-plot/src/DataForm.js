// @flow

import * as React from 'react';
import EditTable from 'material-ui-table-edit'

export default ({data, setData}) =>
  <div style={{width: '30%'}}>
    <h3>Data</h3>
    <EditTable
      onChange={row => console.log(row)}
      rows={[]}
      headerColumns={[
        {
          value: 'x', type: 'TextField', width: 100
        },
        {
          value: 'y', type: 'TextField', width: 100
        }
      ]}
      enableDelete
    />
  </div>
