import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play';
import { Scores } from './scores';
import { About } from './about';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

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
              <NavLink className='nav-link' to=''>
                Login
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='play'>
                Play
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='scores'>
                Scores
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='about'>
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
            href='https://github.com/webprogramming260/simon-react'
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

export default App;
