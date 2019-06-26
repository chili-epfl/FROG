// @flow

import { Meteor } from 'meteor/meteor';
import React from 'react';
import { isEmpty, omit } from 'lodash';
import { A } from 'frog-utils';
import Delta from 'quill-delta';

import RenderLearningItem from '../LearningItem/RenderLearningItem';
import { dataFn } from './wikiLearningItem';

// taken from op-richText-diff - should be moved to common location
const transform = (item, toDiff) => {
  const fromDiff = new Delta(item.text);
  const diff = fromDiff.diff(new Delta(toDiff.text));

  for (let i = 0; i < diff.ops.length; i += 1) {
    const op = diff.ops[i];
    // if the change was an insertion
    if (op.hasOwnProperty('insert')) {
      // color it green
      op.attributes = {
        ...op.attributes,
        background: '#cce8cc',
        color: '#003700'
      };
    }
    // if the change was a formatting change
    if (op.hasOwnProperty('retain')) {
      if (!isEmpty(omit(op.attributes, 'author'))) {
        op.attributes = { ...op.attributes, background: '#e6e6ff' };
      }
    }
    // if the change was a deletion
    if (op.hasOwnProperty('delete')) {
      // keep the text
      op.retain = op.delete;
      delete op.delete;
      // but color it red and struckthrough
      op.attributes = {
        background: '#e8cccc',
        color: '#370000',
        strike: true
      };
    }
  }
  const adjusted = fromDiff.compose(diff);
  return adjusted;
};

const toDate = ts => {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() +
    1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
};

const Revisions = ({ doc }) => {
  const [revisions, setRevisions] = React.useState([]);
  const [diffFrom, setDiffFrom] = React.useState(undefined);
  const [diffTo, setDiffTo] = React.useState(undefined);

  React.useEffect(() => {
    const fetch = async () => {
      const result = await new Promise(resolve =>
        Meteor.call('sharedb.get.revisionList', 'li', doc, (err, res) =>
          resolve(res)
        )
      );
      result.reverse();
      setRevisions(result);
    };
    fetch();
  }, []);

  return (
    <div>
      <div style={{ height: '150px', overflow: 'auto' }}>
        {revisions.map((x, i) => {
          return (
            <li key={i}>
              <input
                type="checkbox"
                checked={diffFrom === i}
                onChange={() => {
                  setDiffFrom(i);
                }}
              />
              {'  '}
              <input
                type="checkbox"
                checked={diffTo === i}
                onChange={() => {
                  setDiffTo(i);
                }}
              />{' '}
              -{' '}
              <A
                onClick={() => {
                  setDiffTo(i);
                  setDiffFrom(i === revisions.length - 1 ? i : i + 1);
                }}
              >
                {toDate(x.time)} -{x.contributors.join(', ')}
              </A>
            </li>
          );
        })}
      </div>
      <hr />
      {diffTo !== undefined && diffFrom !== undefined && (
        <>
          <hr />
          <RenderLearningItem
            type="view"
            dataFn={dataFn}
            key={diffTo + diffFrom + 'fromTo'}
            id={doc}
            isPlayback
            data={{
              ...revisions[diffFrom].data,
              payload: {
                text: transform(
                  revisions[diffFrom].data.payload,
                  revisions[diffTo].data.payload
                )
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default Revisions;
