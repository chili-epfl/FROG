import * as React from 'react';
import { type LearningItemT, values } from 'frog-utils';

class Editor extends React.Component<
  { dataFn: Object, data: any, LearningItem: Function },
  {}
> {
  render() {
    const { LearningItem, data } = this.props;
    return (
      <div>
        <div>
          {values(data.reviewItem).map(x => (
            <LearningItem type="view" id={x.li} key={x.li} />
          ))}
        </div>
        <hr />
        <p>
          <b>Review: </b>
        </p>
        {data.reviewId && <LearningItem type="edit" id={data.reviewId} />}
      </div>
    );
  }
}

const Viewer = ({ LearningItem, data }) => (
  <div>
    <div>
      {values(data.reviewItem).map(
        x =>
          console.log(x.li, LearningItem) || (
            <LearningItem type="view" id={x.li} key={x.li} />
          )
      )}
    </div>
    <hr />
    <p>
      <b>Review:</b>
    </p>
    {data.reviewId && <LearningItem type="view" id={data.reviewId} />}
  </div>
);

export default ({
  name: 'Peer-Review',
  id: 'li-peerReview',
  Viewer,
  ThumbViewer: props => <Viewer {...props} />,
  Editor
}: LearningItemT<{ title: string, content: string }>);
