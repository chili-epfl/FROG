// @flow
//
export default {
  main: {
    position: 'absolute',
    top: '50px',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'calc(100% - 50px)'
  },
  noModal: {
    width: '100%',
    height: 'calc(100% - 50px)'
  },
  fullWindow: {
    position: 'relative',
    top: '0px',
    left: '0px',
    height: '100vh',
    width: '100vw'
  },
  fullWindowControl: {
    zIndex: 99,
    border: '1px solid',
    width: '500px',
    position: 'fixed',
    top: '200px',
    left: '200px',
    background: 'lightgreen'
  },
  drawer: {
    marginTop: '48px',
    width: 250,
    height: 'calc(100% - 48px)'
  },
  button: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '10'
  },
  text: {
    width: '125px',
    margin: 'auto'
  }
};
