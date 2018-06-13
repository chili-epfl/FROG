import wordpress from 'wordpress';
import { entries, values } from 'frog-utils';

import pkg from './index';

const generatePage = li => `<style>iframe{width: 1px;min-width: 100%;}</style>
<iframe id="${li}" src="http://localhost:3000/api/learningItem/${li}" scrolling="no">
</iframe>
<script>iFrameResize({log:true, heightCalculationMethod: 'lowestElement'}, '#${li}')</script>`;

const operator = (configData: Object, object: object) => {
  const client = wordpress.createClient({
    url: 'http://localhost:10000',
    username: 'stian',
    password: 'Lubeck'
  });
  entries(object.activityData.payload).forEach(([instance, content]) => {
    if (values(content.data).length > 0 && values(content.data)[0].li) {
      let instanceStr = instance;
      if (object.activityData.structure === 'individual') {
        instanceStr = object.globalStructure.students[instance];
      }
      if (object.activityData.structure.groupingKey) {
        instanceStr = 'group ' + instance;
      }

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
          if (error) {
            console.warn(error);
          }
        }
      );
    }
  });
};

export default { ...pkg, operator };
