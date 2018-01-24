export const meta = {
  name: 'Add category to items',
  shortDesc: 'Aggregate items from groups',
  description: 'Optionally selecting the top n items by score'
};

const config = {
  type: 'object',
  required: ['category', 'value'],
  properties: {
    category: { type: 'string', title: 'Select category key' },
    value: { type: 'string', title: 'Category value' }
  }
};

const operator = (configData, object) => {
  const result = Object.keys(object.activityData.payload).reduce((acc, x) => {
    let items = object.activityData.payload[x].data;
    if (!Array.isArray(items)) {
      items = Object.values(items);
    }
    console.log(x, items);
    items = items.map(it => ({
      ...it,
      category: { ...it.category, [configData.category]: configData.value }
    }));
    return { ...acc, [x]: { data: items } };
  }, {});
  return { ...object.activityData, payload: result };
};

export default ({
  id: 'op-add-cat',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
