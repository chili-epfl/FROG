// @flow

export const meta = {
  name: 'Post to blogs',
  shortName: '->Blog',
  shortDesc: 'Use XML-RPC to post to any blog, like Wordpress',
  description: ''
};

export const config = {
  type: 'object',
  properties: {
    xmlrpc: {
      type: 'string',
      title: 'URL'
    }
  }
};

export default {
  id: 'op-xmlrpc',
  type: 'product',
  config,
  meta
};
