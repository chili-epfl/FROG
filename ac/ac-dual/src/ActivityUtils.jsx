import React from 'react';
import { withState } from 'recompose';
import { TimedComponent } from 'frog-utils';
import { Button } from 'react-bootstrap';

export const styles = {
  button: { width: '90px', margin: '0 5px' },
  text: { width: '100%', fontSize: 'xx-large', textAlign: 'center' },
  guidelines: { width: '100%' },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#bbb',
    position: 'absolute'
  },
  commands: {
    marginTop: '20px'
  }
};

export const texts = {
  en: {
    start: 'Start',
    yes: 'YES',
    no: 'NO',
    question: {
      '0': 'Are they symmetrical?',
      '1': 'Destroy all the bricks! Use left and right arrows to move!',
      '2': 'Now do both together!'
    },
    wait: 'Waiting for next Task',
    end: 'Activity completed! Thank you!'
  },
  fr: {
    start: 'Commencer',
    yes: 'OUI',
    no: 'NON',
    question: 'Sont-ils symétriques?',
    wait: 'Attendez la question suivante',
    end: 'Activité terminée! Merci'
  }
};

export const Form = withState('language', 'setLanguage', null)(
  ({ language, setLanguage, onSubmit, name }) => (
    <React.Fragment>
      <div style={styles.text}>Welcome {name}!</div>
      <div style={styles.text}>Choisis ton langage</div>
      <div style={styles.text}>Choose your language</div>
      <div style={styles.commands}>
        <Button
          style={{ ...styles.button, left: 0 }}
          bsStyle={language === 'fr' ? 'success' : 'default'}
          onClick={() => setLanguage('fr')}
        >
          Français
        </Button>
        <Button
          style={{ ...styles.button, right: 0 }}
          bsStyle={language === 'en' ? 'success' : 'default'}
          onClick={() => setLanguage('en')}
        >
          English
        </Button>
      </div>
      {language !== null && (
        <div style={{ ...styles.commands, width: '100px' }}>
          <Button
            style={{ ...styles.button, width: '100%' }}
            onClick={() => onSubmit(language)}
            bsStyle="primary"
          >
            Submit
          </Button>
        </div>
      )}
    </React.Fragment>
  )
);

export const Guidelines = ({ start, guidelines, lang }) => (
  <React.Fragment>
    <div style={styles.guidelines}>{guidelines}</div>
    <div style={{ ...styles.commands, width: '120px' }}>
      <Button style={{ ...styles.button, width: '100%' }} onClick={start}>
        {texts[lang].start}
      </Button>
    </div>
  </React.Fragment>
);

export const CountDownTimer = TimedComponent(({ timeNow, length, start }) => {
  const timeLeft = Math.ceil((length - Math.ceil(timeNow - start)) / 1000);
  return <div>{timeLeft + ' s'}</div>;
}, 100);

export const Delay = ({ next, delay, lang }) => {
  let delayTimeout;
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(next, delay);
  return (
    <React.Fragment>
      <div style={styles.text}>{texts[lang].wait}</div>
      <CountDownTimer start={Date.now()} length={delay} />
    </React.Fragment>
  );
};
