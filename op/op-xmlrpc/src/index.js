// @flow

export const meta = {
  name: 'Post to WordPress blogs',
  shortName: '->Blog',
  shortDesc: 'Use XML-RPC to post to WordPress blog',
  description: '',
  sink: true
};

export const config = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      title: 'URL to XML-RPC server'
    }
  }
};

export default {
  id: 'op-xmlrpc',
  type: 'product',
  config,
  meta
};
