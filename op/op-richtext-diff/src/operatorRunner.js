import { type productOperatorRunnerT, cloneDeep, uuid } from 'frog-utils';
import { isEmpty, omit } from 'lodash';
import Delta from 'quill-delta';

const transform = (item, toDiff) => {
  const fromDiff = new Delta(item.text);
  const diff = fromDiff.diff(toDiff);

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

const operator = async (configData, { activityData }, dataFn) => {
  const toDiff = new Delta(JSON.parse(configData.toDiff));
  const connection = dataFn.doc.connection;
  const newAD = cloneDeep(activityData);

  for await (const instance of Object.keys(activityData.payload)) {
    const items = await Promise.all(
      Object.values(activityData.payload[instance].data).map(async x => {
        const val = await new Promise(resolve => {
          const doc = connection.get('li', x.li);
          doc.fetch();
          if (doc.type) {
            const result = transform(doc.data.payload, toDiff);
            resolve(result);
          }

          doc.once('load', () => {
            const result = transform(doc.data.payload, toDiff);
            resolve(result);
          });
        });
        const newLI = dataFn.createLearningItem('li-richText', { text: val });
        return { li: newLI };
      })
    );

    const res = items.reduce((acc, y) => {
      const id = y.id || uuid();
      acc[id] = { ...y, id };
      return acc;
    }, {});
    newAD.payload[instance].data = res;
  }

  return newAD;
};

export default (operator: productOperatorRunnerT);
