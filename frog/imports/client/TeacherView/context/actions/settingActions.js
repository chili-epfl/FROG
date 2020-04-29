// @flow

import { Sessions } from '/imports/api/sessions';

const cleanStudentList = studentList =>
  studentList
    ? [
        ...new Set(
          studentList
            .split('\n')
            .map(x => x.trim())
            .filter(x => x.length > 0)
            .sort((a, b) => a.localeCompare(b))
        )
      ].join('\n')
    : '';

export const settingActions = (session: Object) => ({
  updateSettings: (settings: Object) => {
    if (settings) {
      Sessions.update(session._id, {
        $set: {
          settings: {
            ...settings,
            studentlist: cleanStudentList(settings.studentlist)
          }
        }
      });
    }
  }
});
