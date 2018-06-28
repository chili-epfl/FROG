import wordpress from 'wordpress';
import { entries, values } from 'frog-utils';

import pkg from './index';

const generatePage = li => `<style>iframe{width: 1px;min-width: 100%;}</style>
<iframe id="${li}" src="https://icchilisrv3.epfl.ch/api/learningItem/${li}" scrolling="no">
</iframe>
<script>iFrameResize({log:true, heightCalculationMethod: 'lowestElement'}, '#${li}')</script>`;

const operator = (configData: Object, object: object) => {
  console.log('los gehts');
  const client = wordpress.createClient({
    url: 'http://icchilisrv3.epfl.ch:10000',
    username: 'stian',
    password: 'Lubeck'
  });
  entries(object.activityData.payload).forEach(([instance, content]) => {
    if (values(content.data).length > 0 && values(content.data)[0].li) {
      let instanceStr = instance;
      console.log(content.data);
      if (object.activityData.structure === 'individual') {
        instanceStr = object.globalStructure.students[instance];
      }
      if (object.activityData.structure.groupingKey) {
        instanceStr = 'group ' + instance;
      }
      console.log(client);

      client.newPost(
        {
          title: 'Submission by ' + instanceStr,
          content: generatePage(values(content.data)[0].li),
          status: 'publish',
          termNames: {
            category: ['frog']
          }
        },
        (error, data) => {
          console.warn(error, data);
        }
      );
    }
  });
};

export default { ...pkg, operator };
