export const removeActivity = (id: string, updateList: Function) =>
  fetch('http://icchilisrv4.epfl.ch:5000/activities?uuid=eq.'.concat(id), {
    method: 'DELETE'
  }).then(updateList());
