// @flow

import * as React from 'react'
import {type LogT, dashboardViewerPropsT } from 'frog-utils'

const Viewer = ({ data }: dashboardViewerPropsT) => (
  <pre>{JSON.stringify(data,null,2)}</pre>
)

const initData = {
  'consistent': { correct: { count: 0, time: 0 }, wrong: { count: 0, time: 0 } },
  'inconsistent': { correct: { count: 0, time: 0 }, wrong: { count: 0, time: 0 } }
}

const mergeLog = (data: any, dataFn: Object, log: LogT) => {
  console.log(log)
  if(log.type === 'answer' && log.payload){
    const {isCorrect, isConsistent, answer} = log.payload
    const stroopType = isConsistent ? 'consistent': 'inconsistent'
    if( isCorrect === answer ){
      dataFn.numIncr(1, [stroopType, 'correct', 'count'])
    } else {
      dataFn.numIncr(1, [stroopType, 'wrong', 'count'])
    }

  }
}

export default { Viewer, mergeLog, initData }
