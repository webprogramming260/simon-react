import React from 'react';
import "./play.css"

export class Play extends React.Component {
  render() {
    return (
      <main className='bg-secondary'>
        <div className='game'>
          <div className='button-container'>
            <button
              id='green'
              className='game-button button-top-left'
              onClick='game.pressButton(this)'
            ></button>
            <button
              id='red'
              className='game-button button-top-right'
              onClick='game.pressButton(this)'
            ></button>
            <button
              id='yellow'
              className='game-button button-bottom-left'
              onClick='game.pressButton(this)'
            ></button>
            <button
              id='blue'
              className='game-button button-bottom-right'
              onClick='game.pressButton(this)'
            ></button>
            <div className='controls center'>
              <div className='game-name'>
                Simon<sup>&reg;</sup>
              </div>
              <div id='score' className='score center'>
                --
              </div>
              <button className='btn btn-primary' onClick='game.reset()'>
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

