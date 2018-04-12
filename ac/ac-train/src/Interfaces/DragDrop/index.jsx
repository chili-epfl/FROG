// @flow
import React from 'react';
import { DragDropContext } from 'react-dnd';
import update from 'immutability-helper';
import HTML5Backend from 'react-dnd-html5-backend';
import { zipObject, map } from 'lodash';

// UI
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Timer from 'material-ui-icons/Timer';
import ShoppingCart from 'material-ui-icons/ShoppingCart';

// Internal Imports
import {
  CITIES,
  FARES,
  CLASS,
  TRAVELDIRECTION,
  WANTBIKE,
  capitalizeFirstLetter
} from '../../ActivityUtils';
import { SwitchGuidelines } from '../../Guidelines';
import DropElements from './DropElements';
import ItemTypes from './ItemTypes';
import Box from './Box';
import Help from '../Help';

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
  buy: {
    marginLeft: 'auto'
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
      dropBins: [
        {
          id: 'from',
          accepts: ItemTypes.CITY,
          lastDroppedItem: null
        },
        {
          id: 'to',
          accepts: ItemTypes.CITY,
          lastDroppedItem: null
        },
        {
          id: 'travel',
          accepts: ItemTypes.TRAVEL,
          lastDroppedItem: null
        },
        {
          id: 'fare',
          accepts: ItemTypes.FARE,
          lastDroppedItem: null
        },
        {
          id: 'class',
          accepts: ItemTypes.CLASS,
          lastDroppedItem: null
        },
        {
          id: 'bike',
          accepts: ItemTypes.BIKE,
          lastDroppedItem: null
        }
      ],
      boxes: [
        { id: 'city', type: ItemTypes.CITY, values: CITIES },
        { id: 'travel', type: ItemTypes.TRAVEL, values: TRAVELDIRECTION },
        { id: 'fare', type: ItemTypes.FARE, values: FARES },
        { id: 'class', type: ItemTypes.CLASS, values: CLASS },
        { id: 'bike', type: ItemTypes.BIKE, values: WANTBIKE }
      ]
    };
  }

  handleSubmit = () => {
    const { dropBins } = this.state;

    const answerMake = zipObject(
      map(dropBins, key => key.id),
      map(dropBins, value => value.lastDroppedItem)
    );

    this.props.submit(answerMake);
  };

  handleDrop = (index, answer) => {
    const { name } = answer;

    this.setState(
      update(this.state, {
        dropBins: {
          [index]: {
            lastDroppedItem: {
              $set: name
            }
          }
        }
      })
    );
  };

  render() {
    const {
      ticket,
      activity,
      ticker,
      help,
      onHelpOpen,
      onHelpClose,
      classes
    } = this.props;

    const { boxes, dropBins } = this.state;

    return (
      <Grid container>
        <Grid item xs={12} sm={12}>
          <Typography variant="headline" color="secondary" gutterBottom>
            Question
          </Typography>
          <Typography variant="subheading" gutterBottom>
            {ticket}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="title" gutterBottom align="center">
            Your Ticket
          </Typography>
          <Grid container>
            {dropBins.map(({ id, accepts, lastDroppedItem }, index) => (
              <Grid key={id} item xs={12} sm={6}>
                <DropElements
                  accepts={accepts}
                  title={id}
                  lastDroppedItem={lastDroppedItem}
                  onDrop={item => this.handleDrop(index, item)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item sm={6}>
          <Grid container>
            {boxes.map(({ id, type, values }) => (
              <Grid key={id} item sm={id === 'city' ? 12 : 6}>
                <Grid container>
                  <Grid item sm={12}>
                    <Typography variant="title" gutterBottom align="center">
                      {capitalizeFirstLetter(id)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Grid container justify="center">
                      {values.map(item => (
                        <Grid key={item} item sm={4}>
                          <Box name={item} type={type} />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Grid container>
            <IconButton disabled>
              <Timer />
              :{ticker}
            </IconButton>
            <Help onOpen={onHelpOpen} onClose={onHelpClose} open={help}>
              <SwitchGuidelines activity={activity} />
            </Help>
            <IconButton
              color="primary"
              className={classes.buy}
              onClick={this.handleSubmit}
            >
              <ShoppingCart />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const DragDrop = withStyles(styles)(DragDropController);

export default DragDropContext(HTML5Backend)(DragDrop);
