import React from 'react';

import { Button } from 'react-bootstrap';
import { SimonButton } from './simonButton';
import { delay } from './delay';
import { GameEvent, GameNotifier } from './gameNotifier';
import './simonGame.css';

export function SimonGame(props) {
  const userName = props.userName;
  const buttons = new Map();
  const mistakeSound = new Audio(`/error.mp3`);

  const [allowPlayer, setAllowPlayer] = React.useState(false);
  const [sequence, setSequence] = React.useState([]);
  const [playbackPos, setPlaybackPos] = React.useState(0);

  async function onPressed(buttonPosition) {
    if (allowPlayer) {
      setAllowPlayer(false);
      await buttons.get(buttonPosition).ref.current.press();

      if (sequence[playbackPos].position === buttonPosition) {
        if (playbackPos + 1 === sequence.length) {
          setPlaybackPos(0);
          increaseSequence(sequence);
        } else {
          setPlaybackPos(playbackPos + 1);
          setAllowPlayer(true);
        }
      } else {
        saveScore(sequence.length - 1);
        mistakeSound.play();
        await buttonDance();
      }
    }
  }

  async function reset() {
    setAllowPlayer(false);
    setPlaybackPos(0);
    await buttonDance(1);
    increaseSequence([]);

    // Let other players know a new game has started
    GameNotifier.broadcastEvent(userName, GameEvent.Start, {});
  }

  function increaseSequence(previousSequence) {
    const newSequence = [...previousSequence, getRandomButton()];
    setSequence(newSequence);
  }

  // Demonstrates updating state objects based on changes to other state.
  // All setState calls are asynchronous and so you need to wait until
  // that state is updated before you can update dependent functionality.
  React.useEffect(() => {
    if (sequence.length > 0) {
      const playSequence = async () => {
        await delay(500);
        for (const btn of sequence) {
          await btn.ref.current.press();
        }
        setAllowPlayer(true);
      };
      playSequence();
    }
  }, [sequence]);

  async function buttonDance(laps = 5) {
    for (let step = 0; step < laps; step++) {
      for (const btn of buttons.values()) {
        await btn.ref.current.press(100, false);
      }
    }
  }

  function getRandomButton() {
    let b = Array.from(buttons.values());
    return b[Math.floor(Math.random() * b.length)];
  }

  async function saveScore(score) {
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newScore),
      });

      // Let other players know the game has concluded
      GameNotifier.broadcastEvent(userName, GameEvent.End, newScore);

      // Store what the service gave us as the high scores
      const scores = await response.json();
      localStorage.setItem('scores', JSON.stringify(scores));
    } catch {
      // If there was an error then just track scores locally
      updateScoresLocal(newScore);
    }
  }

  function updateScoresLocal(newScore) {
    let scores = [];
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      scores = JSON.parse(scoresText);
    }

    let found = false;
    for (const [i, prevScore] of scores.entries()) {
      if (newScore > prevScore.score) {
        scores.splice(i, 0, newScore);
        found = true;
        break;
      }
    }

    if (!found) {
      scores.push(newScore);
    }

    if (scores.length > 10) {
      scores.length = 10;
    }

    localStorage.setItem('scores', JSON.stringify(scores));
  }

  // We use React refs so the game can drive button press events
  buttons.set('button-top-left', { position: 'button-top-left', ref: React.useRef() });
  buttons.set('button-top-right', { position: 'button-top-right', ref: React.useRef() });
  buttons.set('button-bottom-left', { position: 'button-bottom-left', ref: React.useRef() });
  buttons.set('button-bottom-right', { position: 'button-bottom-right', ref: React.useRef() });

  const buttonArray = Array.from(buttons, ([key, value]) => {
    return <SimonButton key={key} ref={value.ref} position={key} onPressed={() => onPressed(key)}></SimonButton>;
  });

  return (
    <div className='game'>
      <div className='button-container'>
        <>{buttonArray}</>
        <div className='controls center'>
          <div className='game-name'>
            Simon<sup>&reg;</sup>
          </div>
          <div className='score center'>{sequence.length === 0 ? '--' : sequence.length - 1}</div>
          <Button variant='primary' onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
