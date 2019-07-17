import { type LearningItemT } from '/imports/frog-utils';
import Viewer from './hypothesis';

export default ({
  name: 'Hypothesis',
  id: 'li-hypothesis',
  dataStructure: { title: '', content: '' },
  Viewer,
  ThumbViewer: Viewer,
  search: (data, search) =>
    data.rows.some(
      x =>
        (x.text && x.text.toLowerCase().includes(search)) ||
        (x.quotation && x.quotation.toLowerCase().includes(search))
    )
}: LearningItemT<{ title: string, content: string }>);
