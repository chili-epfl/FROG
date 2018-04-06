import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import * as React from 'react';

class Command extends React.Component {
  state = {
    text: ''
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = () => {
    console.log('HandleSubmit of CliActivity called');
    // const fullAnswer = this.state.text
    //   .split(' ')
    //   .filter(item => item !== 'from' && item !== 'to');
    // const fromTo = fullAnswer.slice(0, 2);

    // const ticket = {
    //   from: answer[0],
    //   to: answer[1],
    //   fare: answer[2]
    // };
    this.props.submit();
  };

  render() {
    const { ticket } = this.props;
    return (
      <React.Fragment>
        <Typography gutterBottom>{ticket}</Typography>
        <TextField
          id="multiline-flexible"
          label="Enter command"
          value={this.state.text}
          onChange={this.handleChange}
          multiline
          rowsMax="4"
          fullWidth
          margin="normal"
        />
        <Button color="primary" onClick={this.handleSubmit}>
          Buy
        </Button>
      </React.Fragment>
    );
  }
}

export default Command;
