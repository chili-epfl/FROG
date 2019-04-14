import * as React from 'react'
import { render } from 'react-dom'
import { connection } from './connection';
import { useReactive } from './ReactiveHOC'

const Display = () => {
  const [data, dataFn, timeout] = useReactive(
    connection,
    'worksheets',
    '1a191b165-429b-40a3-9c81-e48dc249d7b0'
  );
  if (timeout) {
    return <h1>Timeout</h1>;
  }
  if (!data) {
    return '...';
  }
  console.log(dataFn);
  return <div>{JSON.stringify(data)}</div>;
};
render(<Display />, document.getElementById('render-target'));
