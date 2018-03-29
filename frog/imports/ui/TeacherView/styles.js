import blue from 'material-ui/colors/blue';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 0,
    margin: 0
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  button: {
    marginBottom: 16
  },
  statusTitle: {
    width: 250
  },
  emptyDiv: {
    width: 50
  },
  icon: {
    color: 'white'
  },
  rightIcon: {
    marginRight: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  popperClose: {
    pointerEvents: 'none'
  },
  sessionButton: {
    padding: 0,
    margin: 0,
    minWidth: 35
  },
  paperCenter: {
    textAlign: 'center',
    verticalAlign: 'middle',
    margin: 0,
    padding: 0
  },
  paperRight: {
    padding: 0,
    margin: 0,
    textAlign: 'right',
    verticalAlign: 'top'
  },
  textRight: {
    textAlign: 'right'
  },
  textCenter: {
    textAlign: 'center'
  },
  controlBtn: {
    minWidth: 15,
    margin: 3
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
});

export default styles;
