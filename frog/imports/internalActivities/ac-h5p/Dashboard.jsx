import React from 'react';
import { CountChart } from 'frog-utils';

const Viewer = ({ data, config, instances, students }: Object) => {
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
  return (
    <div>
      <h1>Engagement</h1>
      <CountChart
        hAxis="Number of students"
        categories={data.answers.map(x => x.choice)}
        data={answerCounts[qIndex]}
      />
      {Object.keys(data).map(q => (
        <React.Fragment key={q}>
          <h1>{data[q].name}</h1>
          {JSON.stringify(data[q].students)}
        </React.Fragment>
      ))}
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, rawlog: LogDBT) => {
  const log = JSON.parse(rawlog.payload.msg);
  if (!data.students[rawlog.userId]) {
    dataFn.objInsert(true, [students, rawlog.userId]);
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
