const XOR = (a, b) => (a && !b) || (!a && b);

export const objFilter = (
  fConfig: {
    field: string,
    value?: string,
    remove?: boolean,
    removeUndefined?: boolean
  },
  obj: Object
) =>
  (!fConfig.removeUndefined || obj[fConfig.field] !== undefined) &&
  !!XOR(
    fConfig.remove,
    fConfig.value ? obj[fConfig.field] === fConfig.value : obj[fConfig.field]
  );

const operator = (configData, object) => {
  const structure = object.activityData.structure;
  const payload = {};
  const oap = object.activityData.payload;
  Object.keys(oap).forEach(instance => {
    payload[instance] = { data: {} };
    Object.keys(oap[instance].data).forEach(objKey => {
      if (objFilter(configData, oap[instance].data[objKey])) {
        payload[instance].data[objKey] = oap[instance].data[objKey];
      }
    });
  });
  return { structure, payload };
};

export default operator;
