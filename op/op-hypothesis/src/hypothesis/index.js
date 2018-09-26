import * as React from 'react';
import { Annotation, Indented, Hypothesis } from './Annotation';

const Thread = ({ data, item }) => {
  const next = data.filter(x => x.lastRef === item.id);

  next.sort((x, y) => x.updated > y.updated);

  return (
    <>
      <Annotation {...item} />
      {next.length > 0 && (
        <Indented>
          {next.map(x => (
            <Thread key={x.id} data={data} item={x} />
          ))}
        </Indented>
      )}
    </>
  );
};

const HypothesisThread = ({ data }) => {
  const annotations = data.rows;
  const top = annotations.find(x => !x.lastRef);
  return (
    <Hypothesis>
      <Thread data={annotations} item={top} />
    </Hypothesis>
  );
};

export default HypothesisThread;
