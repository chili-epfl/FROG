import React from 'react';
import Stringify from 'json-stringify-pretty-compact';
import ReactTooltip from 'react-tooltip';

export default ({ logs }) => (
  <div>
    <table>
      <thead>
        <tr>
          <th>timestamp</th>
          <th style={{ width: '50px' }}>userId</th>
          <th style={{ width: '50px' }}>instanceId</th>
          <th>activityType</th>
          <th>type</th>
          <th>itemId</th>
          <th>value</th>
          <th style={{ width: '50px' }}>payload</th>
          <th style={{ width: '50px' }}>raw</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(x => (
          <tr key={x._id}>
            <td>{x.timestamp.toTimeString()}</td>
            <td style={{ width: '50px' }}>{x.userId}</td>
            <td style={{ width: '50px' }}>{x.instanceId}</td>
            <td>{x.activityType}</td>
            <td>{x.type}</td>
            <td>{x.itemId}</td>
            <td>{x.value}</td>
            <td
              data-tip={
                x.payload && Stringify(x.payload).replace(/\n/gi, '<br>')
              }
              style={{ width: '50px' }}
            >
              Payload
            </td>
            <td
              data-tip={Stringify(x).replace(/\n/gi, '<br>')}
              style={{ width: '50px' }}
            >
              raw
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <ReactTooltip multiline />
  </div>
);
