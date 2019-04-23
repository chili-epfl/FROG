export const HighlightSearchText = ({
  haystack,
  needle,
  shorten
}: {
  haystack: string,
  needle?: string,
  shorten?: boolean
}) => {
  let result = haystack;
  if (shorten) {
    const contents = result
      .trim()
      .replace(/\n+/g, '\n')
      .replace(/[^\S\r\n]+/g, ' ')
      .replace(/[^\S\r\n]\n/g, '\n');

    let i = 0;
    let line = 0;
    let c = 0;
    let acc = '';
    while (true) {
      const char = contents[i];
      if (!char) {
        break;
      }
      if (char === '\n') {
        c += 40 - Math.min(line, 40);
        line = 0;
      } else {
        c += 1;
        line += 1;
      }
      if (c > 500) {
        acc += '...';
        break;
      }
      acc += char;
      i += 1;
    }
    result = acc;
  }

  if (!needle) {
    return (
      <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{result}</div>
    );
  }
  const parts = result.split(new RegExp(`(${needle})`, 'gi'));
  return (
    <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === needle.toLowerCase()
              ? {
                  backgroundColor: '#FFFF00'
                }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </div>
  );
};

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
              attributes: Object.assign({}, op.attributes, {
                background: '#ffff00'
              })
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

export const cloneDeep = (o: any): any => {
  let newO;
  let i;

  if (typeof o !== 'object') return o;

  if (!o) return o;
  if (o instanceof Date) return new Date(o.valueOf());
  if (Object.prototype.toString.apply(o) === '[object Array]') {
    newO = [];
    for (i = 0; i < o.length; i += 1) {
      newO[i] = cloneDeep(o[i]);
    }
    return newO;
  }

  newO = {};
  // eslint-disable-next-line no-restricted-syntax
  for (i in o) {
    if (Object.prototype.hasOwnProperty.call(o, i)) {
      newO[i] = cloneDeep(o[i]);
    }
  }
  return newO;
};
