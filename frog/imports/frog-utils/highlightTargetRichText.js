// @flow

import { isString, split } from 'lodash';

export const highlightTargetRichText = (content: Object, target: string) => {
  const processedOps = [];
  content.ops.forEach(op => {
    if (isString(op.insert)) {
      const pieces = split(op.insert, new RegExp(target, 'i'));

      if (pieces.length > 1) {
        let targetIdxPtr = 0;
        pieces.forEach((piece, index) => {
          processedOps.push({ ...op, insert: piece });
          targetIdxPtr += piece.length;

          if (index !== pieces.length - 1) {
            processedOps.push({
              insert: op.insert.substring(
                targetIdxPtr,
                targetIdxPtr + target.length
              ),
              attributes: { ...op.attributes, background: '#ffff00' }
            });
            targetIdxPtr += target.length;
          }
        });
        return;
      }
    }
    processedOps.push(op);
  });
  return { ops: processedOps };
};
