import * as React from 'react';
import { Annotation, Indented, Hypothesis } from './Annotation';

const Thread = ({
  data,
  item,
  toggleFn,
  thumbnail,
  threadLength,
  expandable,
  shouldShorten,
  search
}) => {
  const next = data.filter(x => x.lastRef === item.id);

  next.sort((x, y) => x.updated > y.updated);

  return (
    <>
      <Annotation
        {...item}
        shouldShorten={shouldShorten}
        toggleFn={toggleFn}
        thumbnail={thumbnail}
        threadLength={threadLength}
        expandable={expandable}
        search={search}
      />
      {next.length > 0 && (
        <Indented>
          {next.map(x => (
            <Thread search={search} key={x.id} data={data} item={x} />
          ))}
        </Indented>
      )}
    </>
  );
};

class HypothesisThread extends React.Component<
  { data: Object, search?: string },
  { expand: boolean }
> {
  state = { expand: true };

  toggleFn = () => this.setState({ expand: !this.state.expand });

  render() {
    const annotations = this.props.data.rows;
    const top = annotations.find(x => !x.lastRef);
    const { type, search } = this.props;
    const shouldShorten = type === 'thumbView';

    return (
      <Hypothesis>
        <Thread
          data={!shouldShorten && this.state.expand ? annotations : []}
          search={search}
          threadLength={!this.state.expand && annotations.length - 1}
          item={top}
          toggleFn={this.toggleFn}
          expandable={!shouldShorten && annotations.length > 1}
          shouldShorten={shouldShorten}
        />
      </Hypothesis>
    );
  }
}

export default HypothesisThread;
