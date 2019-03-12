// @flow

import * as React from 'react';

import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { getAllLearningItems } from './helpers';

const doc = connection.get('li');
console.log(connection);
const dataFn = generateReactiveFn(doc, LI);
console.log(dataFn);
const LearningItem = dataFn.LearningItem;

type WikiCompPropsT = { 
  match: {
    params: {
      wikiId: string,
      pageId: ?string,
    }
  }
};

class WikiComp extends React.Component<WikiCompPropsT> {
  constructor(props) {
    super(props);
    console.log(props);
    this.wikiId = this.props.match.params.wikiId;
    this.state = {
      learningItems: [],
    };
  }

  componentDidMount() {
    getAllLearningItems(this.wikiId)
    .then((learningItems) => {
      this.setState({
        learningItems: learningItems,
      });
    });
  }

  createLI = () => {
    const meta = {
      wikiId: this.wikiId,
    };

    const newLI = dataFn.createLearningItem(
      'li-richText',
      undefined,
      meta,
      undefined,
      undefined,
      undefined
    );
    console.log(newLI);
    
    this.setState(prevState => ({
      learningItems: [...prevState.learningItems, newLI]
    }));
  }

  deleteLI = () => {
    const id = this.state.learningItems[0];
    console.log(id);
    throw new Error('NOT IMPLEMENTED');
  }

  render() {
    const { wikiId, pageId } = this.props.match.params;

    console.log(this.state.learningItems);

    const learningItems = this.state.learningItems.map((id) => {
      return (
        <div key={id}>
          <LearningItem type="edit" id={id} />
        </div>
      );
    });

    return (
      <div>
        <h1>Wiki: {wikiId}, page: {pageId}</h1>
        <div>
          {learningItems}
        </div>
        <div>
          <a onClick={this.createLI}>
            Create learning item
          </a>
        </div>
        <div>
          <a onClick={this.deleteLI}>
            Delete first LI
          </a>
        </div>
      </div>
    );
  }
}

export default WikiComp;
