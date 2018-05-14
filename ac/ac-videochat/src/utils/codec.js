// Set Opus as the default audio codec if it's present.
export const preferOpus = sdp => {
  let sdpLines = sdp.split('\r\n');
  let mLineIndex;

  // Search for m line.
  sdpLines.forEach((sdpLine, index) => {
    if (sdpLine.search('m=audio') !== -1) {
      mLineIndex = index;
    }
  });

  if (mLineIndex === (null || undefined)) {
    return sdp;
  }

  // If Opus is available, set it as the default in m line.
  sdpLines.forEach(sdpLine => {
    if (sdpLine.search('opus/48000') !== -1) {
      const opusPayload = extractSdp(sdpLine, /:(\d+) opus\/48000/i);
      if (opusPayload) {
        sdpLines[mLineIndex] = setDefaultCodec(
          sdpLines[mLineIndex],
          opusPayload
        );
      }
    }
  });

  // Remove CN in m line and sdp.
  sdpLines = removeCN(sdpLines, mLineIndex);

  return sdpLines.join('\r\n');
};

const extractSdp = (sdpLine, pattern) => {
  const result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
};

// Set the selected codec to the first in m line.
const setDefaultCodec = (mLine, payload) => {
  const elements = mLine.split(' ');
  const newLine = [];
  let index = 0;
  for (let i = 0; i < elements.length; i += 1) {
    if (index === 3) {
      // Format of media starts from the fourth.
      newLine[index] = payload; // Put target payload to the first.
      index += 1;
    }
    if (elements[i] !== payload) {
      newLine[index] = elements[i];
      index += 1;
    }
  }
  return newLine.join(' ');
};

// Strip CN from sdp before CN constraints is ready.
const removeCN = (sdpLines, mLineIndex) => {
  const mLineElements = sdpLines[mLineIndex].split(' ');
  // Scan from end for the convenience of removing an item.
  for (let i = sdpLines.length - 1; i >= 0; i -= 1) {
    const payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if (payload) {
      const cnPos = mLineElements.indexOf(payload);
      if (cnPos !== -1) {
        // Remove CN payload from m line.
        mLineElements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      sdpLines.splice(i, 1);
    }
  }

  sdpLines[mLineIndex] = mLineElements.join(' ');
  return sdpLines;
};
