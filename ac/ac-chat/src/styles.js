export default {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    background: 'white'
  },
  header: {
    flex: '0 0 auto',
    margin: '0',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'center'
  },
  inputContainer: {
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'row',
    background: '#EAEAEA',
    justifyContent: 'center',
    padding: '20px'
  },
  content: {
    flex: '1 1 auto',
    overflowY: 'auto',
    listStyle: 'none',
    padding: '0 20px'
  },
  msg: {
    margin: '20px 0',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '200px 200px 200px 0px',
    width: 'fit-content'
  },
  user: {
    fontSize: '10pt',
    paddingBottom: '2px',
    color: '#0606066b'
  }
};
