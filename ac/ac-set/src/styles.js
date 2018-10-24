export default () => ({
  main: {
    backgroundColor: '#fff',
    height: '100%',
    width: 'auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  introContainer: {
    height: 400,
    width: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
    padding: 16,
    backgroundColor: '#eef',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
  },
  button: {
    margin: '10px'
  },
  example: {
    width: 200,
    flex: '0 0 100px',
    margin: 4,
    padding: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#555'
  },
  exampleInIntro: {
    height: 80,
    flex: '0 0 160px',
    margin: 4,
    padding: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#555'
  },
  list: {
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
  },
  listTitle: {
    textAlign: 'center',
    alignSelf: 'center'
  },
  exampleListsContainer: {
    flex: 1,
    width: 'calc(100% - 8px)',
    padding: 4,
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  examplesList: {
    flex: 1,
    display: 'flex',
    flexFlow: 'column wrap',
    alignItems: 'center',
    overflow: 'auto'
  },
  bottomContainer: {
    marginTop: 4,
    padding: 8,
    width: 'calc(100% - 16px)',
    backgroundColor: '#eef',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
  },
  bottom: {
    maxWidth: 666,
    margin: 'auto',
    width: '100%'
  },
  nocursor: {
    cursor: 'not-allowed'
  }
});
