// @flow

import * as React from 'react';
import FlipMove from '@houshuang/react-flip-move';
import {
  ListGroup
} from 'react-bootstrap';


import Answer from './Answer';



export default (props) => {
  const {  data, userID } = props;
  const { answers } = data;

  const memAnswers = answers[userID];

  return (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {Object.keys(memAnswers || {})
          .sort((a, b) => memAnswers[a] - memAnswers[b])
          .map(answer => (
            <div key={answer + userID}>
              <Answer
                {...props}
                answer={answer}
                key={answer + userID}
                memAnswers={memAnswers}
              />
            </div>
          ))}
      </FlipMove>
    </ListGroup>
  </div>
);
};
