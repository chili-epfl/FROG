// @flow

// max replace 5 times, to avoid searching for a, and getting hundreds of replacements that need
// to be highlighted
export const highlightSearchHTML = (haystack: string, needle: string) => {
  if (!needle) {
    return haystack;
  }
  let c = 0;
  return haystack.replace(new RegExp(needle, 'gi'), str => {
    c += 1;
    return c > 5
      ? str
      : `<span style="background-color: #FFFF00">${str}</span>`;
  });
};
