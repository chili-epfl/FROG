import { $ } from 'meteor/jquery'

export const divStyle = {
  position: 'static',
  zIndex: 0,
  display:'inline-block',
  width: '100%',
  overflowX: 'scroll',
  overflowY: 'hidden',
  border: 1,
  borderStyle: 'solid',
  borderColor: 'white',
  background: '#ffffff'
}

export const divListStyle = {
  position: 'relative',
  display:'inline-block',
  width: '100%',
  border: 1,
  borderStyle: 'solid',
  borderColor: 'white',
  background: 'white',
}

export const divListStyleNoActivity = {
  position: 'relative',
  display:'inline-block',
  width: '100%',
  border: 1,
  textAlign:'center',
  borderStyle: 'solid',
  borderColor: 'white',
  background: 'white',
}
// #b62020 dark red
export const divStyleNeg = (activity) => {
  return {
    background: 'white',
    borderRadius: 4,
    border: 2,
    width: $('#box' + activity._id).outerWidth()+1,
    height: $('#box' + activity._id).outerHeight(),
    margin: 10,
    padding: 10,
    float: 'left',
    position: 'absolute',
    borderStyle: 'solid',
    color: '#286090',
    borderColor: '#286090'
  }
}

export const divStyleAc = () => {
  return {
    background: 'white',
    borderRadius: 4,
    border: 2,
    height: 40,
    margin: 10,
    padding: 10,
    float: 'left',
    position: 'relative',
    borderStyle: 'solid',
    borderColor: 'grey'
  }
}
