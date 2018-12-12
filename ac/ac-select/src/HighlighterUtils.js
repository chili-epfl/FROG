export const findAll = ({
  autoEscape,
  caseSensitive = false,
  findChunks = defaultFindChunks,
  sanitize,
  searchWords,
  textToHighlight
}) =>
  fillInChunks({
    chunksToHighlight: combineChunks({
      chunks: findChunks({
        autoEscape,
        caseSensitive,
        sanitize,
        searchWords,
        textToHighlight
      })
    }),
    totalLength: textToHighlight ? textToHighlight.length : 0
  });

export const combineChunks = ({ chunks }) => {
  const chunksTmp = chunks
    .sort((first, second) => first.start - second.start)
    .reduce((processedChunks, nextChunk) => {
      // First chunk just goes straight in the array...
      if (processedChunks.length === 0) {
        return [nextChunk];
      } else {
        // ... subsequent chunks get checked to see if they overlap...
        const prevChunk = processedChunks.pop();
        if (nextChunk.start <= prevChunk.end) {
          // It may be the case that prevChunk completely surrounds nextChunk, so take the
          // largest of the end indeces.
          const endIndex = Math.max(prevChunk.end, nextChunk.end);
          processedChunks.push({ start: prevChunk.start, end: endIndex });
        } else {
          processedChunks.push(prevChunk, nextChunk);
        }
        return processedChunks;
      }
    }, []);

  return chunksTmp;
};

const defaultFindChunks = ({ searchWords, textToHighlight }) =>
  searchWords
    .filter(searchWord => searchWord) // Remove empty words
    .reduce((chunks, searchWord) => {
      const regex = new RegExp('[^\\p{L}](' + searchWord + ')[^\\p{L}]', 'gui');
      let match = regex.exec(':' + textToHighlight + ':');
      while (match) {
        const start = match.index;
        const end = regex.lastIndex - 2;
        // We do not return zero-length matches
        if (end > start) {
          chunks.push({ start, end });
        }
        // Prevent browsers like Firefox from getting stuck in an infinite loop
        // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
        if (match.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }
        match = regex.exec(':' + textToHighlight);
      }
      return chunks;
    }, []);

export { defaultFindChunks as findChunks };

export const fillInChunks = ({ chunksToHighlight, totalLength }) => {
  const allChunks = [];
  const append = (start, end, highlight) => {
    if (end - start > 0) {
      allChunks.push({
        start,
        end,
        highlight
      });
    }
  };

  if (chunksToHighlight.length === 0) {
    append(0, totalLength, false);
  } else {
    let lastIndex = 0;
    chunksToHighlight.forEach(chunk => {
      append(lastIndex, chunk.start, false);
      append(chunk.start, chunk.end, true);
      lastIndex = chunk.end;
    });
    append(lastIndex, totalLength, false);
  }
  return allChunks;
};
