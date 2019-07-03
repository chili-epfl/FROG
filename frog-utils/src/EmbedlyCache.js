// @flow

export const EmbedlyCache = {};

export const getEmbedlyCache = (item: string) =>
  // $FlowFixMe
  new Promise(resolve => {
    if (EmbedlyCache[item]) {
      resolve(EmbedlyCache[item]);
    }
    fetch('//noembed.com/embed?url=' + item.replace(/(<([^>]+)>)/gi, ''))
      .then(x => x.json())
      .then(x => {
        EmbedlyCache[item] = x.html;
        resolve(x.html);
      });
  });
