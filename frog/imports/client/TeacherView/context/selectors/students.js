// @flow

type Student = {
  _id: string,
  username: string
};

export const studentState = (students: Student[]) => ({
  numberOfStudent: students.length,
  students
});
