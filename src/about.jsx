import React from 'react';
import "./about.css"

export class About extends React.Component {
  render() {
    return (
      <main className='container-fluid bg-secondary text-center'>
        <div>
          <div id='picture' className='picture-box'></div>

          <p>
            Simon is a repetative memory game where you follow the demonstrated
            color sequence until you make a mistake. The longer the sequence you
            repeat, the greater your score.
          </p>

          <p>
            The name Simon is a registered trademark of Milton-Bradley. Our use
            of the name and the game is for non-profit educational use only. No
            part of this code or program should be used outside of that
            definition.
          </p>

          <div id='quote' className='quote-box bg-light text-dark'></div>
        </div>
      </main>
    );
  }
}
