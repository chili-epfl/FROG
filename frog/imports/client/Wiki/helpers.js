import { connection } from '../App/connection';

const getAllLearningItems = function(wikiId: string) {
  return new Promise((resolve, reject) => {
    connection.createFetchQuery(
      'li', 
      { liType: 'li-richText', wikiId: wikiId }, 
      null, 
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          const learningItems = results.map((doc) => {
            return doc.id;
          });
          resolve(learningItems);
        }
      }
    );
  })
}

export { getAllLearningItems }