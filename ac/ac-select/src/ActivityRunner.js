// @flow

import * as React from 'react';
import { type ActivityRunnerT, HTML } from 'frog-utils';
import Highlighter from "react-highlight-words";

// const randomComponent = () => {
//     const hex = (156+Math.floor(Math.random()*100)).toString(16);
//     return hex.length === 1 ? "0" + hex : hex;
// }

// const genRGBHexa = () => "#" + randomComponent() + randomComponent() + randomComponent()

// the actual component that the student sees
const ActivityRunner = ({ activityData, data, dataFn, userInfo }) => {
  const onClick = () => {
    const s = window.getSelection()
    let selected = ''
    if(s.isCollapsed){
      s.modify('move', 'forward', 'character');
      s.modify('move', 'backward', 'word');
      s.modify('extend', 'forward', 'word');
      selected = s.toString()
      s.modify('move', 'forward', 'character'); // clear selection
    }
    if(data[selected] === undefined)
      dataFn.objInsert([userInfo.id], selected)
    else if (!data[selected].includes(userInfo.id))
        dataFn.objReplace(data[selected], [...data[selected], userInfo.id], selected)
    else if(data[selected].length > 1)
      dataFn.objReplace(data[selected], data[selected].filter(u => u !== userInfo.id), selected)
    else
      dataFn.objDel(data[selected], selected)
  }
  console.log(data)
  return (
  <div onClick={onClick}>
    <h1>{activityData.config ? activityData.config.title : ''}</h1>
    <Highlighter
    searchWords={Object.keys(data).filter(x => data[x].includes(userInfo.id))}
    // highlightStyle={{backgroundColor: genRGBHexa()}}
    autoEscape
    textToHighlight={activityData.config ? activityData.config.text : ''}
  />
    {/* <span style={{ fontSize: '20px' }}>
      {activityData.config ? activityData.config.text : ''}
    </span> */}
  </div>
)};

export default (ActivityRunner: ActivityRunnerT);
