// @flow

import { filter, cloneDeep, isString } from 'lodash';

export const shorten = (text: string, length: number): string => {
  const t = text || '';
  if (t.length < length) {
    return t;
  }
  return `${t.slice(0, length - 3)}...`;
};

export const shortenRichText = (
  dataRaw: { ops: Object[] },
  length: number
): Object => {
  const data = cloneDeep(dataRaw);
  const ops = filter(data.ops, op => isString(op.insert));
  let contentLength = 0;
  let cutOffIndex = -1;
  let cutOffLength = 0;

  ops.forEach((op, index) => {
    delete op.attributes;
    op.insert = op.insert
      .trim()
      .replace(/\n+/g, '\n')
      .replace(/[^\S\r\n]+/g, ' ')
      .replace(/[^\S\r\n]\n/g, '\n');

    contentLength += op.insert.length;

    if (cutOffIndex < 0 && contentLength > length - 3) {
      cutOffIndex = index;
      cutOffLength = contentLength - (length - 3);
    }
  });

  if (contentLength <= length) {
    return { ops };
  } else {
    const trimmedOps = ops.slice(0, cutOffIndex);

    const edgeOp = ops[cutOffIndex];
    edgeOp.insert = edgeOp.insert.slice(0, edgeOp.insert.length - cutOffLength);
    trimmedOps.push(edgeOp);

    trimmedOps.push({ insert: '...' });
    return { ops: trimmedOps };
  }
};
