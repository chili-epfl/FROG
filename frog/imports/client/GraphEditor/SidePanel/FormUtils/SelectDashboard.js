import React from 'react';
import { FormControl } from 'react-bootstrap';

const SelectDashboard = ({ choices, onChange, value = '', emptyErr }: any) => (
  <span>
    {choices && choices.length > 0 ? (
      <FormControl
        onChange={e => onChange(e.target.value)}
        componentClass="select"
        value={value}
      >
        {['', ...choices].map(x => (
          <option value={x.id || ''} key={x.id || 'choose'}>
            {x === '' ? 'Choose a dashboard' : x.title}
          </option>
        ))}
      </FormControl>
    ) : (
      <span style={{ color: 'red' }}>{emptyErr}</span>
    )}
  </span>
);

export default SelectDashboard;
