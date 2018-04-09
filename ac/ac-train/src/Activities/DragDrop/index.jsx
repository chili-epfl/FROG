import React from 'react';
import { withStyles } from 'material-ui/styles';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'recompose';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { cities, fares, travelClass, travel } from '../../ActivityUtils';
import DropElements from './DropElements';
import ItemTypes from './ItemTypes';

const drag = [
  { title: 'Cities', values: cities },
  { title: 'Fares', values: fares },
  { title: 'Travel', values: travel },
  { title: 'TravelClass', values: travelClass }
];

// console.log(drag[0].title);
// fares,
//   travelClass,
//   travel

const styles = theme => ({
  root: {},
  formControls: {
    display: 'flex',
    flexDirection: 'column',
    padding: '100px'
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    height: '100px'
  })
});

const Dustbin = () => true;

class DragDropController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dustbins: [
        { accepts: [ItemTypes.CITY], lastDroppedItem: null },
        { accepts: [ItemTypes.TRAVEL], lastDroppedItem: null },
        { accepts: [ItemTypes.FARE], lastDroppedItem: null },
        { accepts: [ItemTypes.OTHER], lastDroppedItem: null }
      ],
      boxes: [{ name: 'City', type: ItemTypes.CITY }],
      droppedBoxNames: []
    };
  }

  handleSubmit = () => {
    this.props.submit();
  };

  handleDrop = (index, item) => {
    const { name } = item;
    const droppedBoxNames = name ? { $push: [name] } : {};

    this.setState(
      update(this.state, {
        dustbins: {
          [index]: {
            lastDroppedItem: {
              $set: item
            }
          }
        },
        droppedBoxNames
      })
    );
  };

  render() {
    const { ticket, classes } = this.props;
    const { boxes, dustbins } = this.state;

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="title" gutterBottom align="center">
              Your Ticket
            </Typography>
            <Grid container>
              {dustbins.map(({ accepts, lastDroppedItem }, index) => (
                <Dustbin
                  accepts={accepts}
                  lastDroppedItem={lastDroppedItem}
                  onDrop={item => this.handleDrop(index, item)}
                  key={index}
                />
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            {drag.map(items => (
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <Typography variant="title" gutterBottom align="center">
                    {items.title}
                  </Typography>
                </Grid>
                {items.values.map(item => (
                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom align="center">
                      {item}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Button color="primary" onClick={this.handleSubmit}>
          Buy
        </Button>
      </div>
    );
  }
}

const DragDrop = withStyles(styles)(DragDropController);

export default DragDropContext(HTML5Backend)(DragDrop);
