// @flow

import * as React from 'react';
import Button from '@material-ui/core/Button';

const transfo = ['log', 'exp', 'outliers', 'sqrt', 'x100', '+50', '11x-10E[x]'];

const disabledFun = (data, tr) => {
  switch (tr) {
    case 'log':
      return data.values.reduce((acc,cur) => acc || Number.isNaN(Math.log(cur[0])), false)
    case 'sqrt':
      return data.values.reduce((acc,cur) => acc || Number.isNaN(Math.sqrt(cur[0])), false)
    default:
      return false;
  }
};

export default ({ setTransformation, transformation, data }: Object) => (
  <>
    Transformations:
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: '10px'
      }}
    >
      {transfo.map(tr => (
        <Button
          disabled={disabledFun(data, tr)}
          varian="contained"
          key={tr}
          onClick={() => {
            if (transformation !== tr) setTransformation(tr);
            else setTransformation('');
          }}
          style={{ backgroundColor: transformation === tr ? '#DDD' : '#FFF' }}
        >
          {tr}
        </Button>
      ))}
    </div>
  </>
);
