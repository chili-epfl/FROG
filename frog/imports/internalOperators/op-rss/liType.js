import * as React from 'react';
import {
  type LearningItemT,
  HTML,
  highlightSearchHTML,
  HighlightSearchText,
  withVisibility
} from '/imports/frog-utils';
import { Fab } from '@material-ui/core';
import Play from '@material-ui/icons/PlayCircleFilled';
import Stop from '@material-ui/icons/Stop';
import ReactSound from 'react-sound';

const ThumbViewer = ({ data }) => (
  <React.Fragment>
    <img alt="rss logo" src="https://i.imgur.com/t3opF7y.png" />
    <b>{data.title} </b>
    <i>(from {data.blogtitle})</i>
  </React.Fragment>
);

const Viewer = withVisibility(({ data, visible, toggleVisibility, search }) => (
  <React.Fragment>
    <img alt="rss logo" src="https://i.imgur.com/t3opF7y.png" />
    <h2>
      <HighlightSearchText haystack={data.title} search={search} />
    </h2>
    {data.enclosure && (
      <>
        <Fab
          onClick={toggleVisibility}
          color="primary"
          aria-label={visible ? 'stop' : 'play'}
        >
          {visible ? <Stop /> : <Play />}
        </Fab>
        <ReactSound
          url={data.enclosure}
          playStatus={
            visible ? ReactSound.status.PLAYING : ReactSound.status.STOPPED
          }
        />
      </>
    )}
    <br />
    <i>
      (from {data.blogtitle}
      {data.date && `, ${new Date(data.date).toLocaleDateString()} - `}
      {data.author && `by ${data.author})`})
    </i>
    <br />
    <br />
    <HTML html={highlightSearchHTML(data.content, search)} />
  </React.Fragment>
));

export default ({
  name: 'RSS',
  id: 'li-rss',
  dataStructure: { title: '', content: '' },
  ThumbViewer,
  Viewer,
  search: (data, search) =>
    data.title.toLowerCase().includes(search) ||
    data.content.toLowerCase().includes(search)
}: LearningItemT<{ title: string, content: string }>);
