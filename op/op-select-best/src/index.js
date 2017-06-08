// @flow

import { values, flatten, uniqBy } from 'lodash';

export const meta = {
  name: 'Aggregate best ideas',
  type: 'product'
};

export const config = {
  type: 'object',
  properties: {
    n: {
      type: 'number',
      title: 'Number of ideas per group'
    }
  }
};

export const operator = (configData, object) => {
  const prod = object.products;
  const sel = Object.keys(prod).map(x => prod[x].ideas);
  const sel2 = sel.map(x =>
    values(x)
      .sort((a, b) => b.score - a.score)
      .slice(0, (configData && configData.n) || 1)
  );
  const ret = flatten(sel2);
  return { all: uniqBy(ret, x => x.id) };
};

export default {
  id: 'op-select-best',
  operator,
  config,
  meta
};

if (require.main === module) {
  const c = {
    '0': {
      ideas: {
        cj3opwduc001axrj19mahrls0: { id: 1, score: 1, title: 'hi' },
        cj3opwdud001bxrj1h557r6ef: { id: 2, score: 1, title: 'hi' },
        cj3opwdue001cxrj1hrip6l3d: { id: 3, score: 3, title: 'hi' },
        cj3opwdue001dxrj1i1eol0at: { id: 4, score: 2, title: 'hi' },
        config: {}
      },
      '1': {
        ideas: {
          cj3opwduo001fxrj1v66csiy3: { id: 10, score: 3, title: 'hi' },
          cj3opwduo001gxrj10dg30s6s: { id: 9, score: 4, title: 'hi' },
          cj3opwdup001hxrj11jvp7iby: { id: 3, score: 5, title: 'hi' },
          cj3opwdup001ixrj1uhvgo4yy: { id: 44, score: 2, title: 'hi' },
          config: {}
        }
      }
    }
  };

  console.log(operator({ n: 2 }, { products: c }));
}
