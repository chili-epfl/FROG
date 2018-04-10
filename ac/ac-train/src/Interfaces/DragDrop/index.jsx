import React from 'react';
import { withStyles } from 'material-ui/styles';
import { DragDropContext } from 'react-dnd';
import update from 'immutability-helper';
import HTML5Backend from 'react-dnd-html5-backend';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import {
  cities,
  fares,
  travelClass,
  travel,
  capitalizeFirstLetter
} from '../../ActivityUtils';
import DropElements from './DropElements';
import ItemTypes from './ItemTypes';
import Box from './Box';

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

class DragDropController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropBins: {
        from: {
          accepts: ItemTypes.CITY,
          lastDroppedItem: null
        },
        to: {
          accepts: ItemTypes.CITY,
          lastDroppedItem: null
        },
        travel: {
          accepts: ItemTypes.TRAVEL,
          lastDroppedItem: null
        },
        fare: {
          accepts: ItemTypes.FARE,
          lastDroppedItem: null
        },
        class: {
          accepts: ItemTypes.CLASS,
          lastDroppedItem: null
        },
        bike: {
          accepts: ItemTypes.BIKE,
          lastDroppedItem: null
        }
      },
      boxes: [
        { id: 'city', type: ItemTypes.CITY, values: cities },
        { id: 'travel', type: ItemTypes.TRAVEL, values: travel },
        { id: 'fare', type: ItemTypes.FARE, values: fares },
        { id: 'class', type: ItemTypes.CLASS, values: travelClass },
        { id: 'bike', type: ItemTypes.BIKE, values: ['yes', 'no'] }
      ]
    };
  }

  handleSubmit = () => {
    this.props.submit();
  };

  handleDrop = (type, answer) => {
    const { name } = answer;

    this.setState(
      update(this.state, {
        dropBins: {
          $merge: {
            [type]: {
              ...this.state.dropBins[type],
              lastDroppedItem: name
            }
          }
        }
      })
    );
  };

  render() {
    const { ticket, classes } = this.props;
    const { boxes, dropBins } = this.state;

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Typography gutterBottom>{ticket}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="title" gutterBottom align="center">
              Your Ticket
            </Typography>
            <Grid container>
              {Object.keys(dropBins).map(bin => (
                <Grid key={bin} item xs={12} sm={6}>
                  <DropElements
                    accepts={this.state.dropBins[bin].accepts}
                    title={bin}
                    lastDroppedItem={this.state.dropBins[bin].lastDroppedItem}
                    onDrop={item => this.handleDrop(bin, item)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            {boxes.map(({ id, type, values }) => (
              <Grid key={id} container>
                <Grid item xs={12} sm={12}>
                  <Typography variant="title" gutterBottom align="center">
                    {capitalizeFirstLetter(id)}
                  </Typography>
                </Grid>
                {values.map(item => (
                  <Grid key={item} item xs={12} sm={3}>
                    <Box name={item} type={type} />
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
