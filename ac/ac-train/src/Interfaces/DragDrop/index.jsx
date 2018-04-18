// @flow
import React from 'react';
import { withDragDropContext } from 'frog-utils';
import update from 'immutability-helper';
import HTML5Backend from 'react-dnd-html5-backend';
import { zipObject, map } from 'lodash';
import { compose } from 'recompose';

// UI
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
// Internal Imports
import {
  CITIES,
  FARES,
  CLASS,
  TRAVELDIRECTION,
  WANTBIKE,
  capitalizeFirstLetter
} from '../../ActivityUtils';
import Actions from '../Actions';
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

type PropsT = {
  ticket: string,
  submit: Function,
  onHelpOpen: Function,
  onHelpClose: Function,
  help: boolean,
  classes: Object,
  activity: string,
  ticker: string
};
type StateT = {
  dropBins: Array<{
    id: string,
    accepts: string,
    lastDroppedItem: string
  }>,
  boxes: Array<{
    id: string,
    type: string,
    values: Array<string>
  }>
};

class DragDropController extends React.Component<PropsT, StateT> {
  constructor(props) {
    super(props);

    this.state = {
      dropBins: [
        {
          id: 'from',
          accepts: ItemTypes.CITY,
          lastDroppedItem: ''
        },
        {
          id: 'to',
          accepts: ItemTypes.CITY,
          lastDroppedItem: ''
        },
        {
          id: 'travel',
          accepts: ItemTypes.TRAVEL,
          lastDroppedItem: ''
        },
        {
          id: 'fare',
          accepts: ItemTypes.FARE,
          lastDroppedItem: ''
        },
        {
          id: 'class',
          accepts: ItemTypes.CLASS,
          lastDroppedItem: ''
        },
        {
          id: 'bike',
          accepts: ItemTypes.BIKE,
          lastDroppedItem: ''
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
    const { ticket, classes, ...actionProps } = this.props;

    const { boxes, dropBins } = this.state;

    return (
      <Grid container spacing={16}>
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
          <Grid container spacing={16}>
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
          <Grid container spacing={24}>
            {boxes.map(({ id, type, values }) => (
              <Grid key={id} item sm={id === 'city' ? 12 : 6}>
                <Grid container spacing={24}>
                  <Grid item sm={12}>
                    <Typography variant="title" gutterBottom align="center">
                      {capitalizeFirstLetter(id)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Grid container spacing={8} justify="center">
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
            <Actions submitAnswer={this.handleSubmit} {...actionProps} />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const DragDrop = compose(withDragDropContext, withStyles(styles))(
  DragDropController
);

export default DragDrop;
