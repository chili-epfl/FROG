import * as React from 'react';
import {
  Button,
  TextField,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  submit: {
    background: '#31BFAE',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    transition: '.25s ease',
    cursor: 'pointer',

    '&:hover': {
      background: '#25a697'
    }
  }
}));

type TemplateModalProps = {
  open: boolean,
  callback: () => void,
  onSubmit: (name: string, graphId: string) => void,
  graph: string
};

const TemplateModal = (props: TemplateModalProps) => {
  const classes = useStyle();

  const [values, setValues] = React.useState({
    name: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle>Save as Template</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Template Name"
          onChange={handleChange('name')}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              props.onSubmit(values.name, props.graph);
            }
          }}
          name="name"
          autoComplete="name"
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => {
            props.onSubmit(values.name, props.graph);
          }}
        >
          Save
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.callback}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateModal;
