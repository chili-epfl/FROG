const fetch = require('node-fetch');
const cuid = require('cuid');
const wiki = 'alfa3';

const links = {};
const getLink = title => {
  if (links[title]) return links[title];
  const id = cuid();
  links[title] = id;
  return id;
};

const postWiki = (wiki, page, content) =>
  fetch(
    `http://localhost:3000/api/wikiSubmit?wiki=${wiki}&id=${getLink(
      page
    )}&page=${page}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(content)
    }
  );

const regexp = /\[([^\]]+)]/g;

const convertLink = doc => ({
  text: {
    ops: doc
      .replace(/\[/g, '[|||')
      .replace(/\]/g, '|||]')
      .split(/\[|\]/g)
      .map(x =>
        x.slice(0, 3) === '|||'
          ? {
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
            }
          : { insert: x }
      )
  }
});

postWiki(
  wiki,
  'HALLO',
  convertLink('Hi this is a link to [peter], and [niels]')
);
postWiki(wiki, 'peter', convertLink('nO links here...'));
postWiki(
  wiki,
  'niels',
  convertLink('Hi this is a link to [peter], and [HALLO]')
);
