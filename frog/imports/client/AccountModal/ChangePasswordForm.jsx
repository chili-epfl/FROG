/* eslint-disable no-unused-expressions */
// disable no-unused-expressions for flow typing state when using hooks
// @flow
import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useToast } from '/imports/ui/Toast';
import { passwordErrors } from '/imports/frog-utils/validationHelpers';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(2, 0, 2, 0)
  }
}));

type ChangePasswordFormPropsT = {
  onChangePassword: (oldPassword: string, newPassword: string) => void
};
type ChangePasswordFormStateT = {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string,
  showPassword: boolean
};

const ChangePasswordForm = ({ onChangePassword }: ChangePasswordFormPropsT) => {
  const classes = useStyles();
  const [showToast] = useToast();
  const [values, setValues] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    showPassword: false
  });
 
 const [errors, setErrors] = React.useState({
  oldPassword: '', 
  newPassword: '', 
  confirmNewPassword: ''
 })

  const handleChange = prop => event => {
    setErrors({...errors, [prop]:''})
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  const handleSubmit = event => {
    event.preventDefault();
    const formValid = (values.oldPassword !=='' && values.newPassword === values.confirmNewPassword && passwordErrors(values.newPassword) === '') 
    if (formValid){
      onChangePassword(values.oldPassword, values.newPassword); 
    }
    else {
       if (values.oldPassword === ''){
       setErrors({...errors, oldPassword: 'Old password cannot be empty'}); 
       }
      
     if (values.newPassword !== values.confirmNewPassword)
      setErrors({...errors, confirmNewPassword: 'Password does not match'}); 
    if (passwordErrors(values.newPassword) !== '')
        setErrors({...errors, newPassword: 'New ' + passwordErrors(values.newPassword)})

    }
   

  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change password
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            error = {errors.oldPassword !== ''}
            helperText = {errors.oldPassword}
            fullWidth
            onChange={handleChange('oldPassword')}
            id="oldpassword"
            label="Old password "
            name="oldpassword"
            type={values.showPassword ? 'text' : 'password'}
            autoComplete="password"
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            onChange={handleChange('newPassword')}
            required
            fullWidth
            name="newpassword"
            label="New Password"
            error = {errors.newPassword !== ''}
            helperText = {errors.newPassword}
            type={values.showPassword ? 'text' : 'password'}
            id="newpassword"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={handleChange('confirmNewPassword')}
            name="confirmnewpassword"
            label="Confirm new password"
            type={values.showPassword ? 'text' : 'password'}
            error={errors.confirmNewPassword !== ''}
            helperText={errors.confirmNewPassword}
            id="confirmnewpassword"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Change Password
          </Button>
        </form>
      </div>
    </Container>
  );
};
export default ChangePasswordForm;
