import * as React from 'react';
import { makeStyles, Container, Typography, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { Header } from './Header';
import { Footer } from './Footer';
import { StepRow } from './StepRow';
import { ActivityCard } from './ActivityCard';
import { primaryColor, primaryColorDark } from './constants';
import { withRouter } from 'react-router';
import { useModal } from '/imports/ui/Modal';
import AccountModal from '/imports/client/AccountModal/AccountModal';


const useStyle = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  section: {
    width: '100%',
    maxWidth: '100%',
    padding: theme.spacing(10, 6),
    color: blueGrey[800],
    marginTop: theme.spacing(8) // Header Placeholder
  },
  title: {
    width: '60%',
    minWidth: '300px',
    fontWeight: '400',
    fontSize: '2.75rem',
    marginBottom: theme.spacing(4)
  },
  titleBlue: {
    fontWeight: '500',
    fontSize: '1.75rem',
    color: primaryColor,
    marginBottom: theme.spacing(4)
  },
  subtitle: {
    fontWeight: '500',
    fontSize: '1rem',
    textTransform: 'uppercase',
    color: blueGrey[200],
    letterSpacing: '5px',
    margin: theme.spacing(1)
  },
  paragraph: {
    width: '60%',
    minWidth: '300px',
    fontWeight: '400',
    fontSize: '1rem',
    color: blueGrey[400],
    lineHeight: '2',
    margin: theme.spacing(2, 0)
  },
  lineButton: {
    color: primaryColor,
    textTransform: 'none',
    fontSize: '1rem',
    padding: theme.spacing(0.25),
    fontWeight: '600',
    boxShadow: '0 0 0 transparent',
    borderBottom: `2px solid ${primaryColor}`,
    borderRadius: '0',
    '&:hover': {
      background: 'none'
    },
    '&:active': {
      boxShadow: '0 0 0 transparent'
    }
  },
  stepsWrapper: {
    width: '80%',
    minWidth: '300px',
    margin: '0 auto'
  },
  gradientSection: {
    padding: theme.spacing(8, 0),
    background: `linear-gradient(to bottom right, ${primaryColor}, ${primaryColorDark})`
  },
  whiteh2: {
    color: '#FFF',
    fontSize: '1.6rem',
    textAlign: 'center',
    width: '100%'
  },
  activities: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    minWidth: '300px',
    margin: `${theme.spacing(6)}px auto`
  },
  whiteButton: {
    color: primaryColor,
    background: '#FFF',
    textTransform: 'none',
    fontSize: '0.8rem',
    padding: theme.spacing(1, 3.5),
    fontWeight: '500',
    boxShadow: '0 0 0 transparent',
    borderBottom: `2px solid ${primaryColor}`,
    borderRadius: '25px',
    '&:hover': {
      background: '#FFF'
    },
    '&:active': {
      boxShadow: '0 0 0 transparent'
    }
  },
  alignCenterDiv: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
}));

const LandingPage = ({ history }) => {
  const classes = useStyle();

  const [showModal] = useModal();

  const openLoginModal = () => {
    showModal(<AccountModal formToDisplay="login" />);
  };

  return (
    <div className={classes.root}> 
      <Header openSignin={openLoginModal}/>
      <Container className={classes.section}>
        <Typography variant="h1" className={classes.title}>
          The community platform to augment your in classroom experience
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          FROG is a tool to improve the way you present your lecture. You can
          use these activities to make your classroom interactive while having
          complete control over the progress of the class and all it takes is
          three steps.
        </Typography>
        <Button
        disableFocusRipple
        disableRipple
        className={classes.lineButton}
        onClick={() => history.push('/wizard')}>
          Try it out now
        </Button>
      </Container>
      <Container className={classes.section}>
        <Typography align="center" className={classes.subtitle}>
          For Educators
        </Typography>
        <Typography align="center" className={classes.titleBlue}>
          Built for your way of teaching
        </Typography>
      </Container>
      <Container className={classes.section}>
        <Typography align="center" className={classes.titleBlue}>
          How it works
        </Typography>
        <div className={classes.stepsWrapper}>
          <StepRow
            imageURL="https://picsum.photos/200"
            title="Create your class schedule"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </StepRow>
          <StepRow
            imageURL="https://picsum.photos/300"
            title="Plan and Customize Student Activities"
            variant="reverse"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </StepRow>
          <StepRow
            imageURL="https://picsum.photos/400"
            title="Start your session and monitor progress"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </StepRow>
        </div>
      </Container>
      <Container className={`${classes.section} ${classes.gradientSection}`}>
        <Typography
          variant="h2"
          className={`${classes.title} ${classes.whiteh2}`}
        >
          Start by creating a learning environment
        </Typography>
        <div className={classes.activities}>
          <ActivityCard
            imageURL="https://picsum.photos/100"
            title="Questionnaire"
          />
          <ActivityCard
            imageURL="https://picsum.photos/101"
            title="Knowledge Board"
          />
          <ActivityCard
            imageURL="https://picsum.photos/102"
            title="Student Discussions"
          />
          <ActivityCard
            imageURL="https://picsum.photos/103"
            title="Brainstorm Ideas"
          />
          <ActivityCard
            imageURL="https://picsum.photos/104"
            title="Peer Review Activity"
          />
        </div>
        <div className={classes.alignCenterDiv}>
          <Button className={classes.whiteButton}>
            Learn more about activities
          </Button>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default withRouter(LandingPage);