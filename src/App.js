import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className='App'>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/shop'>Shop</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path='/' element={<Home />} exact />
        <Route path='/about' element={<About />} />
        <Route path='/shop' element={<Shop />} />
        <Route component={Home} />
      </Routes>
    </div>
  );
}

class Home extends React.Component {
  render() {
    return (
      <button
        className='square'
        onClick={() => {
          console.log('click');
        }}
      >
        home
      </button>
    );
  }
}

class About extends React.Component {
  render() {
    return (
      <button
        className='square'
        onClick={() => {
          console.log('click');
        }}
      >
        about
      </button>
    );
  }
}

class Shop extends React.Component {
  render() {
    return (
      <button
        className='square'
        onClick={() => {
          console.log('click');
        }}
      >
        shop
      </button>
    );
  }
}

export default App;
