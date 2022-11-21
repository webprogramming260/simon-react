import React from 'react';
import './play.css';

export function Play() {
  return <Game />;
}

export class Game extends React.Component {
  #buttons;
  #allowPlayer;
  #sequence;
  #playerPlaybackPos;
  #mistakeSound;

  constructor(props) {
    super(props);

    this.#buttons = new Map();
    this.#allowPlayer = false;
    this.#sequence = [];
    this.#playerPlaybackPos = 0;
    this.#mistakeSound = new Audio(`/error.mp3`);

    const sounds = ['sound1.mp3', 'sound2.mp3', 'sound3.mp3', 'sound4.mp3'];
    document.querySelectorAll('.game-button').forEach((el, i) => {
      if (i < sounds.length) {
        this.#buttons.set(el.id, new Button(sounds[i], el));
        el.style.filter = 'brightness(50%)';
      }
    });
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
  }

  async #playSequence(delayms = 0) {
    if (delayms > 0) {
      await delay(delayms);
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
    let btns = Array.from(this.#buttons.values());
    return btns[Math.floor(Math.random() * this.#buttons.size)];
  }

  async #saveScore(score) {
    const userName = localStorage.getItem('userName') ?? 'unknown';
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    try {
      const response = await fetch('/simon-server/api/score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newScore),
      });

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
    document.querySelectorAll('.game-button').forEach((el, i) => {
      console.log(this.#buttons);
      this.#buttons.set(el.id, new Button(el));
    });
  }

  render() {
    return (
      <main className='bg-secondary'>
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

class Button {
  constructor(el) {
    this.el = el;
    this.sound = new Audio(`/${el.id}.mp3`);
  }

  async press(delayms = 500, playSound = true) {
    this.el.classList.remove('light-on');
    if (playSound) {
      this.sound.play();
    }
    await delay(delayms);
    this.el.classList.add('light-on');
    await delay(100);
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
