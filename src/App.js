import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className='body bg-dark text-light'>
      <header className='container-fluid'>
        <nav className='navbar fixed-top navbar-dark'>
          <div className='navbar-brand'>
            Simon<sup>&reg;</sup>
          </div>
          <menu className='navbar-nav'>
            <li className='nav-item'>
              <NavLink className='nav-link active' to='/'>
                Login
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/play'>
                Play
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/scores'>
                Scores
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/about'>
                About
              </NavLink>
            </li>
          </menu>
        </nav>
      </header>

      <Routes>
        <Route path='/' element={<Login />} exact />
        <Route path='/play' element={<Play />} />
        <Route path='/scores' element={<Scores />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <footer className='bg-dark text-dark text-muted'>
        <div className='container-fluid'>
          <span className='text-reset'>Author Name(s)</span>
          <a
            className='text-reset'
            href='https://github.com/webprogramming260/simon-db'
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <main className='container-fluid bg-secondary text-center'>
      404: Return to sender. Address unknown.
    </main>
  );
}

class Login extends React.Component {
  render() {
    return (
      <main className='container-fluid bg-secondary text-center'>
        <div>
          <h1>Welcome</h1>
          <p>Login to play</p>
          <div>
            <input type='text' id='name' placeholder='Your name here' />
            <button className='btn btn-primary' onClick='login()'>
              Login
            </button>
          </div>
        </div>
      </main>
    );
  }
}

class Play extends React.Component {
  render() {
    return (
      <main className='bg-secondary'>
        <div className='game'>
          <div className='button-container'>
            <button
              id='green'
              className='game-button button-top-left'
              onclick='game.pressButton(this)'
            ></button>
            <button
              id='red'
              className='game-button button-top-right'
              onclick='game.pressButton(this)'
            ></button>
            <button
              id='yellow'
              className='game-button button-bottom-left'
              onclick='game.pressButton(this)'
            ></button>
            <button
              id='blue'
              className='game-button button-bottom-right'
              onclick='game.pressButton(this)'
            ></button>
            <div className='controls center'>
              <div className='game-name'>
                Simon<sup>&reg;</sup>
              </div>
              <div id='score' className='score center'>
                --
              </div>
              <button className='btn btn-primary' onclick='game.reset()'>
                Reset
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

class Scores extends React.Component {
  render() {
    return (
      <main className='container-fluid bg-secondary text-center'>
        <table className='table table-warning table-striped-columns'>
          <thead className='table-dark'>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody id='scores'></tbody>
        </table>
      </main>
    );
  }
}

class About extends React.Component {
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

export default App;
