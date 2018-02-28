import React from 'react';
import { CountChart } from 'frog-utils';
import { omit, sum, compact, sortBy } from 'lodash';

const Viewer = ({ data: dataf, config, instances, students }: Object) => {
  // const questions = config.questions
  //   .filter(q => q.question && q.answers)
  //   .map(q => ({ ...q, question: stripHTML(q.question) }));
  // const scatterData =
  //   (config.argueWeighting &&
  //     (instances || ['1', '2', '3', '4']).map(instance => {
  //       const coordinates = [0, 0];
  //       questions.forEach((q, qIndex) => {
  //         if (
  //           data[instance] &&
  //           data[instance][qIndex] &&
  //           q.answers[data[instance][qIndex] - 1]
  //         ) {
  //           const answerIndex = data[instance][qIndex] - 1;
  //           coordinates[0] += q.answers[answerIndex].x;
  //           coordinates[1] += q.answers[answerIndex].y;
  //         }
  //       });
  //       return coordinates;
  //     })) ||
  //   [];

  // const answerCounts = questions.map((q, qIndex) =>
  //   ((data && Object.values(data)) || []).reduce((acc, val) => {
  //     acc[val[qIndex]] += 1;
  //     return acc;
  //   }, q.answers.map(() => 0))
  // );

  // <CountChart
  //   key={qIndex}
  //   title={q.question}
  //   vAxis="Possible answers"
  //   hAxis="Number of answers"
  //   categories={q.answers.map(x => x.choice)}
  //   data={answerCounts[qIndex]}
  // />
  const data = {
    students: { '1': true, '2': true },
    'undefined?subContentId=d06868ac-688b-4a31-8fc4-9f756f7c545d': {
      name: 'What kind of berry is this?\n',
      students: {
        '1': {
          score: { min: 0, max: 1, raw: 1, scaled: 1 },
          completion: true,
          success: true,
          duration: 'PT3.22S',
          response: '1'
        },
        '2': {
          score: { min: 0, max: 1, raw: 1, scaled: 1 },
          completion: true,
          success: true,
          duration: 'PT3.22S',
          response: '1'
        }
      }
    },
    'undefined?subContentId=ac89ad57-8a23-402e-86dd-c5f7fcb3f08f': {
      name: 'Highlight the ingredients that have been added so far.\n',
      students: {
        '1': {
          score: { min: 0, max: 2, raw: 0, scaled: 0 },
          completion: true,
          success: false,
          duration: 'PT1.34S',
          response: ''
        }
      }
    }
  };
  const d = omit(data, 'students');
  return (
    <div>
      <h1>Engagement</h1>
      {Object.keys(d).map(z => {
        const x = d[z];
        const freq = {};
        const freqmap = Object.keys(x.students).map(
          z => (freq[x.students[z].response] = -~freq[x.students[z].response])
        );

        const success =
          sum(
            compact(
              Object.keys(x.students).map(
                y => x.students[y].score && x.students[y].score.scaled
              )
            )
          ) / Object.keys(x.students).length;
        return (
          <div key={x.name}>
            <h2>{x.name}</h2>Students participated:{' '}
            {Object.keys(x.students).length}
            <br />Average success rate: {success}
          </div>
        );
      })}
      <hr />
      <p>
        Total students who have interacted: {Object.keys(data.students).length}
      </p>
    </div>
  );
};

// <CountChart
//   hAxis="Number of students"
//   categories={data.answers.map(x => x.choice)}
//   data={answerCounts[qIndex]}
// />
// {Object.keys(data).map(q => (
//   <React.Fragment key={q}>
//     <h1>{data[q].name}</h1>
//     {JSON.stringify(data[q].students)}
//   </React.Fragment>
// ))}
const mergeLog = (data: any, dataFn: Object, rawlog: LogDBT) => {
  const log = JSON.parse(rawlog.payload.msg);
  if (!data.students[rawlog.userId]) {
    dataFn.objInsert(true, ['students', rawlog.userId]);
  }
  if (log.verb && log.verb.id === 'http://adlnet.gov/expapi/verbs/answered') {
    if (!data[log.object.id]) {
      dataFn.objInsert(
        {
          name: log.object.definition.name['en-US'],
          students: {}
        },
        log.object.id
      );
    }
    dataFn.objInsert(log.result, [log.object.id, 'students', rawlog.userId]);
  }
};

const initData = { students: {} };

export default {
  Viewer,
  mergeLog,
  initData
};
