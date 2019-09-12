import * as React from 'react';
import { makeStyles, Container, Typography, Button } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { withRouter } from 'react-router';

import { useModal } from '/imports/ui/Modal';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import { Header } from './Header';
import { Footer } from './Footer';
import { StepRow } from './StepRow';
import { ActivityCard } from './ActivityCard';
import { primaryColor, primaryColorDark } from './constants';

const useStyle = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  section: {
    width: '100%',
    maxWidth: '100%',
    padding: theme.spacing(10, 6),
    color: blueGrey[800]
  },
  introSection: {
    padding: theme.spacing(10, 0),
    backgroundColor: '#FFF',
    marginTop: theme.spacing(8) // Header Placeholder
  },
  title: {
    width: '50%',
    minWidth: '300px',
    fontWeight: '400',
    fontSize: '3.25rem',
    textAlign: 'center',
    color: blueGrey[900]
  },
  titleColor: {
    fontWeight: '500',
    fontSize: '2.25rem',
    color: primaryColor,
    marginBottom: theme.spacing(4)
  },
  subtitle: {
    fontWeight: '500',
    fontSize: '1.4rem',
    textTransform: 'uppercase',
    color: blueGrey[200],
    letterSpacing: '5px',
    margin: theme.spacing(1)
  },
  paragraph: {
    width: '60%',
    minWidth: '300px',
    fontWeight: '400',
    fontSize: '1.4rem',
    color: blueGrey[300],
    lineHeight: '2',
    textAlign: 'center',
    margin: theme.spacing(2, 0)
  },
  lineButton: {
    color: primaryColor,
    textTransform: 'none',
    fontSize: '1.25rem',
    padding: theme.spacing(0.25),
    fontWeight: '600',
    boxShadow: '0 0 0 transparent',
    borderBottom: `2px solid ${primaryColor}`,
    borderRadius: '0',
    cursor: 'pointer',

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
    fontSize: '2rem',
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
    fontSize: '1rem',
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
    width: '100%',
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
      <Header openSignin={openLoginModal} />
      <Container
        className={`${classes.section} ${classes.alignCenterDiv} ${classes.introSection}`}
      >
        <Typography variant="h1" className={classes.title}>
          The community platform to augment your in classroom experience
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          FROG is a tool to improve the way you present your lecture. You can
          use these activities to make your classroom interactive while having
          complete control over the progress of the class and all it takes is
          three steps.
        </Typography>
        <div className={classes.alignCenterDiv}>
          <Button
            disableFocusRipple
            disableRipple
            className={classes.lineButton}
            onClick={() => history.push('/wizard')}
          >
            Try it out now
          </Button>
        </div>
      </Container>
      <Container className={classes.section}>
        <Typography align="center" className={classes.subtitle}>
          For Educators
        </Typography>
        <Typography align="center" className={classes.titleColor}>
          Built for your way of teaching
        </Typography>
        <div className={classes.alignCenterDiv}>
          <iframe
            title="Video Tutorial"
            style={{
              width: '50vw',
              minWidth: '300px',
              height: 'calc((9/16)*50vw)'
            }}
            src="https://www.youtube.com/embed/N2v13ZLb7IY"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Container>
      <Container className={classes.section}>
        <Typography align="center" className={classes.titleColor}>
          How it works
        </Typography>
        <div className={classes.stepsWrapper}>
          <StepRow imageURL="Step1Icon.png" title="Create your class schedule">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </StepRow>
          <StepRow
            imageURL="Step2Icon.png"
            title="Plan and Customize Student Activities"
            variant="reverse"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </StepRow>
          <StepRow
            imageURL="Step3Icon.png"
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
            onClick={() => history.push('/wizard/ac-quiz')}
            imageURL="Question.png"
            title="Questionnaire"
          />
          <ActivityCard
            onClick={() => history.push('/wizard/ac-ck-board')}
            imageURL="IdeaBoard.png"
            title="Idea board"
          />
          <ActivityCard
            imageURL="Chat.png"
            title="Chat"
            onClick={() => history.push('/wizard/ac-chat')}
          />
          <ActivityCard
            onClick={() => history.push('/wizard/ac-brainstorm')}
            imageURL="Brainstorm.png"
            title="Brainstorm Ideas"
          />
          <ActivityCard
            onClick={() => history.push('/wizard/te-peerReview')}
            imageURL="PeerReview.png"
            title="Peer Review Activity"
          />
        </div>
        <div className={classes.alignCenterDiv}>
          <Button
            className={classes.whiteButton}
            onClick={() => history.push('/wizard')}
          >
            Learn more about activities
          </Button>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default withRouter(LandingPage);
