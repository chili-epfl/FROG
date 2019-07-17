import * as React from 'react';
import { type LearningItemT, values, HTML } from '/imports/frog-utils';

const FlexViewer = ({ LearningItem, data, type }) => (
  <div>
    {type !== 'thumbView' && (
      <>
        <div>
          {values(data.reviewItem).map(x => (
            <LearningItem type="view" id={x.li} key={x.li} />
          ))}
        </div>
        <hr />
        <p>
          <HTML html={data.prompt} />
        </p>
      </>
    )}
    {data.reviewId && <LearningItem type={type} id={data.reviewId} />}
  </div>
);

export default ({
  name: 'Peer-Review',
  id: 'li-peerReview',
  Viewer: props => <FlexViewer type="view" {...props} />,
  ThumbViewer: props => <FlexViewer type="thumbView" {...props} />,
  Editor: props => <FlexViewer type="edit" {...props} />
}: LearningItemT<{ title: string, content: string }>);
