// @flow

import * as React from 'react';
import { TextInput, getEmbedlyCache } from '/imports/frog-utils';
import { throttle } from 'lodash';

class Creator extends React.Component<*, *> {
  constructor(props) {
    super(props);
    this.state = { url: '', embed: '' };
  }

  onKeyDown = e => {
    const str = (e || '').trim();
    if (str.length > 0) {
      getEmbedlyCache(str).then(emb => {
        if (emb) {
          this.setState({ embed: emb });
        }
      });
    }
  };

  onKeyDownThrottled = throttle(this.onKeyDown, 500);

  render() {
    const { embed } = this.state;
    return (
      <>
        URL to embed:
        <TextInput
          onChange={e => {
            this.setState({ url: e });
            this.onKeyDownThrottled(e);
          }}
        />
        {embed !== '' ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: embed }} />
            <button
              onClick={() => {
                this.props.createLearningItem('li-embed', {
                  html: embed,
                  url: this.state.url
                });
              }}
            >
              Create
            </button>
          </>
        ) : (
          '...'
        )}
      </>
    );
  }
}

export default ({
  name: 'Embed URL',
  id: 'li-embed',
  Viewer: props => (
    <div dangerouslySetInnerHTML={{ __html: props.data.html }} />
  ),
  Creator
}: LearningItemT<*>);
