require('util').inspect.defaultOptions.depth = null;
const fs = require('fs');
const fetch = require('node-fetch');
const cuid = require('cuid');

const wiki = process.argv[2];

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function sleep(n) {
  msleep(n * 1000);
}

const links = {};
const getLink = (rawtitle, create) => {
  const title = rawtitle
    .replace(/^:(.+?)/g, '$1')
    .replace(/ /g, '_')
    .replace(':', '-')
    .toLowerCase()
    .trim();
  if (links[title]) return links[title];
  if (create) {
    const id = cuid();
    links[title] = id;
    return id;
  } else {
    return undefined;
  }
};

// const baseurl = 'https://icchilisrv3.epfl.ch';
const baseurl = 'http://localhost:3000';

const postWiki = async (page, content) => {
  console.log(
    `Preparing fetch ${baseurl}/api/wikiSubmit?wiki=${wiki}&id=${getLink(
      page
    )}&page=${page}`
  );
  const f = await fetch(
    `${baseurl}/api/wikiSubmit?wiki=${wiki}&id=${getLink(page)}&page=${page}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content)
    }
  );
  const fe = await f.text();
};

const regexp = /\[([^\]]+)]/g;

const tap = x => x; // console.log(x) || x;

const convertLink = doc => ({
  text: {
    ops: tap(
      (doc + '\n')
        .replace(/(\/\/.+?\/\/)/g, '[#!$1]')
        .replace(/\[\[(.+)\]\]/g, '[|||$1|||]')
        .replace(/h(\d). (.+)\n/g, '[##h$1$2]')
        .replace(/(^ *\* .+\n)/gm, '[!!$1]')
        .replace(/(^ *- .+\n)/gm, '[!#$1]')
        .replace(/\[\@(.+?)\]/g, '[|||notes-$1|||]')
        .split(/\[|\]/g)
    )
      .map(x => {
        if (x.slice(0, 3) === '##h') {
          return [
            { insert: x.slice(4) },
            {
              insert: '\n',
              attributes: { title: parseInt(x.slice(3, 4), 10) }
            }
          ];
        }
        if (x.slice(0, 2) === '!!') {
          const len = x.slice(2).match(/^ */)[0].length;
          const indent = len - 2 > 2 ? len / 2 : undefined;
          const retObj = [
            { insert: x.slice(len + 4, -1) },
            { insert: '\n', attributes: { list: 'bullet' } }
          ];
          if (indent) {
            retObj[1].attributes.indent = indent;
          }
          return retObj;
        }
        if (x.slice(0, 2) === '#!') {
          const len = x.slice(2).match(/^ */)[0].length;
          const indent = len - 2 > 2 ? len / 2 : undefined;
          const retObj = [
            { insert: x.slice(len + 4, -1) },
            { insert: '\n', attributes: { list: 'bullet' } }
          ];
          if (indent) {
            retObj[1].attributes.indent = indent;
          }
          return { insert: x.slice(4, -2), attributes: { italic: true } };
        }
        if (x.slice(0, 2) === '!#') {
          const len = x.slice(2).match(/^ */)[0].length;
          const indent = len - 2 > 2 ? len / 2 : undefined;
          const retObj = [
            { insert: x.slice(len + 4, -1) },
            { insert: '\n', attributes: { list: 'ordered' } }
          ];
          if (indent) {
            retObj[1].attributes.indent = indent;
          }
          return retObj;
        }
        if (x.slice(0, 3) === '|||') {
          if (x.slice(3, 7) === 'http') {
            let [link, text] = x.slice(3, -3).split('|');
            if (!link) {
              text = link;
            }
            return { insert: text || '', attributes: { link } };
          }

          // console.log(x.slice(3, -3), getLink(x.slice(3, -3)));
          if (getLink(x.slice(3, -3))) {
            return {
              insert: {
                'wiki-link': {
                  title: x.slice(3, -3),
                  id: getLink(x.slice(3, -3)),
                  wikiId: wiki,
                  liId: getLink(x.slice(3, -3)),
                  created: true,
                  valid: true
                }
              }
            };
          } else {
            return {
              insert: x.slice(3, -3)
            };
          }
        }
        return { insert: x };
      })
      .reduce(
        (acc, x) => (x ? [...acc, ...(Array.isArray(x) ? x : [x])] : acc),
        []
      )
      .concat([{ insert: '\n' }])
  }
});

const titlecase = str => str.slice(0, 1).toUpperCase() + str.slice(1);

const processFile = async name => {
  const contents = fs.readFileSync('./pages/' + name, 'utf-8');
  const title = name.slice(0, -4);
  await postWiki(
    titlecase(title.replace(/_/g, ' ').replace('/', '-')),
    convertLink(contents)
  );
};

const doImport = () => {
  // pre-process to store IDs
  fs.readdirSync('./pages/')
    .filter(name => name.slice(-4) === '.txt')
    .forEach(name => getLink(name.slice(0, -4), true));

  const pages = fs
    .readdirSync('./pages/')
    .filter(name => name.slice(-4) === '.txt');

  asyncForEach(pages, async name => {
    await processFile(name);
  });

  fs.readdirSync('./pages/researchr/')
    .filter(name => name.slice(-4) === '.txt')
    .forEach(name => getLink('researchr-' + name.slice(0, -4), true));

  const researchr = fs
    .readdirSync('./pages/researchr/')
    .filter(name => name.slice(-4) === '.txt');
  asyncForEach(researchr, async name => {
    processFile('researchr/' + name);
  });

  fs.readdirSync('./pages/a/')
    .filter(name => name.slice(-4) === '.txt')
    .forEach(name => getLink('a-' + name.slice(0, -4), true));

  const a = fs
    .readdirSync('./pages/a/')
    .filter(name => name.slice(-4) === '.txt');
  asyncForEach(a, async name => {
    processFile('a/' + name);
  });

  fs.readdirSync('./pages/notes/')
    .filter(name => name.slice(-4) === '.txt')
    .forEach(name => getLink('notes-' + name.slice(0, -4), true));

  const notes = fs
    .readdirSync('./pages/notes/')
    .filter(name => name.slice(-4) === '.txt');
  asyncForEach(notes, async name => {
    processFile('notes/' + name);
  });
};

doImport();
