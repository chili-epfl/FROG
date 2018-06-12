import wordpress from 'wordpress';

import pkg from './index';

const operator = (configData: Object, object: object) => {
  const client = wordpress.createClient({
    url: configData.url,
    username: 'houshuang',
    password: 'solothurnswisstext'
  });

  client.newPost(
    {
      title: 'Post from FROG',
      content: 'Publishing to <b>WordPress</b> from node.js sure is fun!',
      status: 'publish',
      termNames: {
        category: ['Javascript', 'Node'],
        post_tag: ['api', 'fun', 'js']
      }
    },
    (error, data) => console.log(error, data)
  );
};

export default { ...pkg, operator };
