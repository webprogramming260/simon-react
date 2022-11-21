import React from 'react';
import './play.css';

export function Play() {
  return <Game />;
}

export class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      buttons: new Map(),
      allowPlayer: false,
      sequence: [],
      playerPlaybackPos: 0,
      mistakeSound: loadSound('error.mp3'),
    };
  }

  buttonPressed(button) {
    // if (this.allowPlayer) {
    //   this.allowPlayer = false;
    //   await this.buttons.get(button.id).press();
    //   if (this.sequence[this.playerPlaybackPos].el.id === button.id) {
    //     this.playerPlaybackPos++;
    //     if (this.playerPlaybackPos === this.sequence.length) {
    //       this.playerPlaybackPos = 0;
    //       this.addNote();
    //       this.updateScore(this.sequence.length - 1);
    //       await this.playSequence(500);
    //     }
    //     this.allowPlayer = true;
    //   } else {
    //     this.saveScore(this.sequence.length - 1);
    //     this.mistakeSound.play();
    //     await this.buttonDance();
    //   }
    // }
  }

  async reset() {
    this.setState({
      allowPlayer: false,
      playerPlaybackPos: 0,
      sequence: [],
    });
    //  this.updateScore('--');
    await this.buttonDance(2);
    // this.addNote();
    // await this.playSequence(1000);
    // this.allowPlayer = true;
  }

  // async #playSequence(delayms = 0) {
  //   if (delayms > 0) {
  //     await delay(delayms);
  //   }
  //   for (const btn of this.sequence) {
  //     await btn.press();
  //   }
  // }

  // #addNote() {
  //   const btn = this.getRandomButton();
  //   this.sequence.push(btn);
  // }

  // #updateScore(score) {
  //   const scoreEl = document.querySelector("#score");
  //   scoreEl.textContent = score;
  // }

  async buttonDance(laps = 5) {
    const btns = document.querySelectorAll('.game-btn');

    for (let lap = 0; lap < laps; lap++) {
      for (let i = 0; i < btns.length; ++i) {
        await delay(180);
        btns[i].click();
      }
    }

    //    console.log(this.props.children);
    // for (let step = 0; step < laps; step++) {
    //   for (const btn of this.buttons.values()) {
    //     await btn.press(100, false);
    //   }
    // }
  }

  // #getRandomButton() {
  //   let btns = Array.from(this.buttons.values());
  //   return btns[Math.floor(Math.random() * this.buttons.size)];
  // }

  // async #saveScore(score) {
  //   const userName = localStorage.getItem("userName") ?? "unknown";
  //   const date = new Date().toLocaleDateString();
  //   const newScore = { name: userName, score: score, date: date };

  //   try {
  //     const response = await fetch("/simon-db/api/score", {
  //       method: "POST",
  //       headers: { "content-type": "application/json" },
  //       body: JSON.stringify(newScore),
  //     });

  //     // Store what the service gave us as the high scores
  //     const scores = await response.json();
  //     localStorage.setItem("scores", JSON.stringify(scores));
  //   } catch {
  //     // If there was an error then just track scores locally
  //     this.updateScoresLocal(newScore);
  //   }
  // }

  // #updateScoresLocal(newScore) {
  //   let scores = [];
  //   const scoresText = localStorage.getItem("scores");
  //   if (scoresText) {
  //     scores = JSON.parse(scoresText);
  //   }

  //   let found = false;
  //   for (const [i, prevScore] of scores.entries()) {
  //     if (newScore > prevScore.score) {
  //       scores.splice(i, 0, newScore);
  //       found = true;
  //       break;
  //     }
  //   }

  //   if (!found) {
  //     scores.push(newScore);
  //   }

  //   if (scores.length > 10) {
  //     scores.length = 10;
  //   }

  //   localStorage.setItem("scores", JSON.stringify(scores));
  // }

  render() {
    const buttons = [];
    ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach((id) => {
      buttons.push(
        <Button key={id} id={id} onClick={(btn) => this.buttonPressed(btn)} />
      );
    });

    return (
      <main className='bg-secondary'>
        <div className='game'>
          <div className='btn-container'>
            {buttons}
            <div className='controls center'>
              <div className='game-name'>
                Simon<sup>&reg;</sup>
              </div>
              <div id='score' className='score center'>
                --
              </div>
              <button className='btn btn-primary' onClick={() => this.reset()}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sound: loadSound(`btn-${props.id}.mp3`),
      light: 'off',
    };
  }

  pressButton() {
    this.press();
    if (this.props.onClick) {
      this.props.onClick(this);
    }
  }

  async press(delayms = 500, playSound = true) {
    this.setState({ light: 'on' });
    if (playSound) {
      this.state.sound.play();
    }
    await delay(delayms);
    this.setState({ light: 'off' });
    await delay(100);
  }

  render() {
    const className = [
      'game-btn',
      'btn-' + this.props.id,
      'light-' + this.state.light,
    ].join(' ');
    return (
      <button className={className} onClick={() => this.pressButton()}></button>
    );
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function loadSound(filename) {
  return new Audio('/' + filename);
}
