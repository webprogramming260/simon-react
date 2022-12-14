import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  let navigate = useNavigate();

  function login() {
    const nameEl = document.querySelector('#name');
    localStorage.setItem('userName', nameEl.value);
    navigate('/play');
  }

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div>
        <h1>Welcome</h1>
        <p>Login to play</p>
        <div>
          <input type='text' id='name' placeholder='Your name here' />
          <button className='btn btn-primary' onClick={() => login()}>
            Login
          </button>
        </div>
      </div>
    </main>
  );
};
