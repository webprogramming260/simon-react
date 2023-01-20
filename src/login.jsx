import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './login.css';

function LoginControl(props) {
  const [userName, setUserName] = useState(props.userName);
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
      <div id='loginControls'>
        <div className='input-group mb-3'>
          <span className='input-group-text'>@</span>
          <input
            className='form-control'
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='your@email.com'
          />
        </div>
        <div className='input-group mb-3'>
          <span className='input-group-text'>🔒</span>
          <input
            className='form-control'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='password'
          />
        </div>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => loginUser()}
        >
          Login
        </button>
        <button
          type='button'
          className='btn btn-secondary'
          onClick={() => createUser()}
        >
          Create
        </button>
      </div>

      <MessageDialog
        message={displayError}
        onHide={() => setDisplayError(null)}
      />
    </>
  );
}

function MessageDialog(props) {
  return (
    <Modal {...props} show={props.message} centered>
      <Modal.Body>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function PlayControl(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => props.onLogout());
  }

  function play() {
    navigate('/play');
  }

  return (
    <div id='playControls'>
      <div id='playerName'>{props.userName}</div>
      <button type='button' className='btn btn-primary' onClick={() => play()}>
        Play
      </button>
      <button
        type='button'
        className='btn btn-secondary'
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  );
}

export function Login() {
  async function getUser(email) {
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
      return response.json();
    }
    return null;
  }

  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  useEffect(() => {
    if (userName) {
      async function isAuthenticated(userName) {
        const user = await getUser(userName);
        setAuthenticated(!!user?.authenticated);
      }
      isAuthenticated(userName);
    }
  }, [userName]);

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div>
        <h1>Welcome to Simon</h1>
        {authenticated ? (
          <PlayControl
            userName={userName}
            onLogout={() => setAuthenticated(false)}
          />
        ) : (
          <LoginControl
            userName={userName}
            onLogin={(loginUserName) => {
              setUserName(loginUserName);
              setAuthenticated(true);
            }}
          />
        )}
      </div>
    </main>
  );
}
