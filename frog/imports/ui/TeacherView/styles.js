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
    marginLeft: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

export default styles;
