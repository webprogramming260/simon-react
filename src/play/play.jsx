import React from 'react';

import { SimonButton } from './simonButton';
import { delay } from './delay';

import './play.css';

export function Play() {
  return <SimonGame />;
}

// Event messages
const GameEndEvent = 'gameEnd';
const GameStartEvent = 'gameStart';

export class SimonGame extends React.Component {
  #userName;
  #buttons;
  #allowPlayer;
  #sequence;
  #playerPlaybackPos;
  #mistakeSound;
  #socket;

  constructor(props) {
    super(props);

    this.#userName = props.userName;
    this.#buttons = new Map();
    this.#allowPlayer = false;
    this.#sequence = [];
    this.#playerPlaybackPos = 0;
    this.#mistakeSound = new Audio(`/error.mp3`);

    this.#configureWebSocket();
  }

  async pressButton(buttonId) {
    if (this.#allowPlayer) {
      this.#allowPlayer = false;
      await this.#buttons.get(buttonId).press();

      if (this.#sequence[this.#playerPlaybackPos].el.id === buttonId) {
        this.#playerPlaybackPos++;
        if (this.#playerPlaybackPos === this.#sequence.length) {
          this.#playerPlaybackPos = 0;
          this.#addNote();
          this.#updateScore(this.#sequence.length - 1);
          await this.#playSequence(500);
        }
        this.#allowPlayer = true;
      } else {
        this.#saveScore(this.#sequence.length - 1);
        this.#mistakeSound.play();
        await this.#buttonDance();
      }
    }
  }

  async reset() {
    this.#allowPlayer = false;
    this.#playerPlaybackPos = 0;
    this.#sequence = [];
    this.#updateScore('--');
    await this.#buttonDance(1);
    this.#addNote();
    await this.#playSequence(1000);
    this.#allowPlayer = true;

    // Let other players know a new game has started
    this.#broadcastEvent(this.#userName(), GameStartEvent, {});
  }

  async #playSequence(delayMs = 0) {
    if (delayMs > 0) {
      await delay(delayMs);
    }
    for (const btn of this.#sequence) {
      await btn.press();
    }
  }

  #addNote() {
    const btn = this.#getRandomButton();
    this.#sequence.push(btn);
  }

  #updateScore(score) {
    const scoreEl = document.querySelector('#score');
    scoreEl.textContent = score;
  }

  async #buttonDance(laps = 5) {
    for (let step = 0; step < laps; step++) {
      for (const btn of this.#buttons.values()) {
        await btn.press(100, false);
      }
    }
  }

  #getRandomButton() {
    let buttons = Array.from(this.#buttons.values());
    return buttons[Math.floor(Math.random() * this.#buttons.size)];
  }

  async #saveScore(score) {
    const date = new Date().toLocaleDateString();
    const newScore = { name: this.#userName, score: score, date: date };

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newScore),
      });

      // Let other players know the game has concluded
      this.#broadcastEvent(this.#userName, GameEndEvent, newScore);

      // Store what the service gave us as the high scores
      const scores = await response.json();
      localStorage.setItem('scores', JSON.stringify(scores));
    } catch {
      // If there was an error then just track scores locally
      this.#updateScoresLocal(newScore);
    }
  }

  #updateScoresLocal(newScore) {
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

  componentDidMount() {
    // These need to be converted to React components
    document.querySelectorAll('.game-button').forEach((el, i) => {
      this.#buttons.set(el.id, new SimonButton(el));
    });
  }

  #configureWebSocket() {
    // When dev debugging we need to talk to the service and not the React debugger
    let port = window.location.port;
    if (process.env.NODE_ENV !== 'production') {
      port = 3000;
    }

    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.#socket = new WebSocket(
      `${protocol}://${window.location.hostname}:${port}/ws`
    );
    this.#socket.onopen = (event) => {
      this.#displayMsg('system', 'game', 'connected');
    };
    this.#socket.onclose = (event) => {
      this.#displayMsg('system', 'game', 'disconnected');
    };
    this.#socket.onmessage = async (event) => {
      try {
        const msg = JSON.parse(await event.data.text());
        if (msg.type === GameEndEvent) {
          this.#displayMsg('player', msg.from, `scored ${msg.value.score}`);
        } else if (msg.type === GameStartEvent) {
          this.#displayMsg('player', msg.from, `started a new game`);
        }
      } catch {}
    };
  }

  #displayMsg(cls, from, msg) {
    const chatText = document.querySelector('#player-messages');
    chatText.innerHTML =
      `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` +
      chatText.innerHTML;
  }

  #broadcastEvent(from, type, value) {
    const event = {
      from: from,
      type: type,
      value: value,
    };
    this.#socket.send(JSON.stringify(event));
  }

  render() {
    return (
      <main className='bg-secondary'>
        <div className='players'>
          Player
          <span className='player-name'>{this.#userName}</span>
          <div id='player-messages'></div>
        </div>
        <div className='game'>
          <div className='button-container'>
            <button
              id='button-top-left'
              className='game-button button-top-left'
              onClick={() => this.pressButton('button-top-left')}
            ></button>
            <button
              id='button-top-right'
              className='game-button button-top-right'
              onClick={() => this.pressButton('button-top-right')}
            ></button>
            <button
              id='button-bottom-left'
              className='game-button button-bottom-left'
              onClick={() => this.pressButton('button-bottom-left')}
            ></button>
            <button
              id='button-bottom-right'
              className='game-button button-bottom-right'
              onClick={() => this.pressButton('button-bottom-right')}
            ></button>
            <div className='controls center'>
              <div className='game-name'>
                Simon<sup>&reg;</sup>
              </div>
              <div id='score' className='score center'>
                --
              </div>
              <button
                className='button button-primary'
                onClick={() => this.reset()}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
