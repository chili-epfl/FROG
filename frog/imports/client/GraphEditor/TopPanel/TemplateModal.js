import * as React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  submit: {
    background: theme.palette.primary.main,
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    transition: '.25s ease',
    cursor: 'pointer',

    '&:hover': {
      background: theme.palette.primary.light
    }
  }
}));

type TemplateModalProps = {
  open: boolean,
  callback: () => void,
  onSubmit: (name: string, graphId: string) => void,
  graphId: string,
  graphName: string
};

const TemplateModal = (props: TemplateModalProps) => {
  const classes = useStyle();

  const { graphName } = props;
  const name = graphName && graphName !== 'Unnamed' ? graphName : '';
  const [values, setValues] = React.useState({
    name
  });

  const handleChange = attr => event => {
    setValues({ ...values, [attr]: event.target.value });
  };

  return (
    <Dialog open={props.open} PaperProps={{ elevation: 1 }}>
      <DialogTitle>Save as Template</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          defaultValue={values.name}
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
