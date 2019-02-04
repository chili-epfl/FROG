import op from '../operatorRunner';

const config = {
  toDiff:
    '{"ops":[{"insert":"hello this is pretty "},{"attributes":{"bold":true},"insert":"interesting"},{"insert":"\\n"}]}'
};

const data = {
  activityData: {
    structure: { groupingKey: 'individual' },
    payload: {
      '1': {
        data: {
          cjr9p77dc002z16sefowtupmk: {
            id: 'cjr9p77dc002z16sefowtupmk',
            li: {
              id: 'cjr9p77c3002j16se9q3u6m90',
              liDocument: {
                liType: 'li-richText',
                payload: {
                  text: {
                    ops: [
                      {
                        insert: 'hi this is very pretty',
                        attributes: {
                          author: 'Xg6zatcGuL7NPK6TN'
                        }
                      },
                      {
                        insert: '\n'
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

test('Basic diff', () => {
  expect(op(config, data)).toMatchSnapshot();
});
