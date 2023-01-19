import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bootstrap } from 'bootstrap/dist/js/bootstrap.bundle.min';
import './login.css';

export class Login extends React.Component {
  navigate = useNavigate();
  authenticated = false;

  constructor(props) {
    super(props);

    const userName = localStorage.getItem('userName');
    if (userName) {
      const nameEl = document.querySelector('#userName');
      nameEl.value = userName;
      this.getUser(nameEl.value).then((user) => {
        this.authenticated = user?.authenticated;
      });
    }
    if (this.authenticated) {
      document.querySelector('#playerName').textContent = userName;
      this.setDisplay('loginControls', 'none');
      this.setDisplay('playControls', 'block');
    } else {
      this.setDisplay('loginControls', 'block');
      this.setDisplay('playControls', 'none');
    }
  }

  async loginUser() {
    this.loginOrCreate(`/api/auth/login`);
  }

  async createUser() {
    this.loginOrCreate(`/api/auth/create`);
  }

  async loginOrCreate(endpoint) {
    const userName = document.querySelector('#userName')?.value;
    const password = document.querySelector('#userPassword')?.value;
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const body = await response.json();
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      window.location.href = 'play.html';
    } else {
      const modalEl = document.querySelector('#msgModal');
      modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
      const msgModal = new bootstrap.Modal(modalEl, {});
      msgModal.show();
    }
  }

  play() {
    this.navigate('/play');
  }

  logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => this.navigate('/'));
  }

  async getUser(email) {
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
      return response.json();
    }
    return null;
  }

  setDisplay(controlId, display) {
    const playControlEl = document.querySelector(`#${controlId}`);
    if (playControlEl) {
      playControlEl.style.display = display;
    }
  }

  render() {
    return (
      <main className='container-fluid bg-secondary text-center'>
        <div>
          <h1>Welcome to Simon</h1>
          <div id='loginControls' style={{ display: 'none' }}>
            <div className='input-group mb-3'>
              <span className='input-group-text'>@</span>
              <input
                className='form-control'
                type='text'
                id='userName'
                placeholder='your@email.com'
              />
            </div>
            <div className='input-group mb-3'>
              <span className='input-group-text'>🔒</span>
              <input
                className='form-control'
                type='password'
                id='userPassword'
                placeholder='password'
              />
            </div>
            <button
              type='button'
              className='btn btn-primary'
              onClick='{() => this.loginUser()}'
            >
              Login
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick='{() => this.createUser()}'
            >
              Create
            </button>
          </div>
          <div id='playControls' style={{ display: 'none' }}>
            <div id='playerName'></div>
            <button
              type='button'
              className='btn btn-primary'
              onClick='{() => this.play()}'
            >
              Play
            </button>
            <button
              type='button'
              className='btn btn-secondary'
              onClick='{() => this.logout()}'
            >
              Logout
            </button>
          </div>
        </div>
        <div className='modal fade' id='msgModal' tabindex='-1'>
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content text-dark'>
              <div className='modal-body'>error message here</div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
