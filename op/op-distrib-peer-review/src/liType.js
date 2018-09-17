import * as React from 'react';
import { type LearningItemT, values } from 'frog-utils';

const Editor = ({ dataFn, data, LearningItem }) => {
  let newReviewId;
  if (data.reviewId) {
    newReviewId = dataFn.createLearningItem('li-textarea', { text: '' });
    dataFn.objInsert(newReviewId, 'reviewId');
  }

  return (
    <div>
      <div>
        {values(data.reviewItem).map(x => (
          <LearningItem type="view" id={x.li} />
        ))}
      </div>
      <LearningItem type="edit" id={data.reviewId || newReviewId} />
    </div>
  );
};

const Viewer = ({ data, LearningItem }) => (
  <div>
    <h1>Hi</h1>
  </div>
);

// <div>
//   {values(data.reviewItem).map(
//     x => console.log(x.li) || <LearningItem type="view" id={x.li} />
//   )}
// <LearningItem type="view" id="cjm65g3ek00013h6jhwyb477k" />;
// </div>
// {data.reviewId && <LearningItem type="view" id={data.reviewId} />}
// </div>
// );

export default ({
  name: 'Peer-Review',
  id: 'li-peerReview',
  Viewer,
  ThumbViewer: props => <Viewer {...props} />,
  Editor
}: LearningItemT<{ title: string, content: string }>);
