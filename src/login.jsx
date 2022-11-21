import React from 'react';

export class Login extends React.Component {
  login() {
    const nameEl = document.querySelector("#name");
    localStorage.setItem("userName", nameEl.value);
    window.location.href = "play.html";
  }
  
  render() {
    return (
      <main className='container-fluid bg-secondary text-center'>
        <div>
          <h1>Welcome</h1>
          <p>Login to play</p>
          <div>
            <input type='text' id='name' placeholder='Your name here' />
            <button className='btn btn-primary' onClick='{this.login()}'>
              Login
            </button>
          </div>
        </div>
      </main>
    );
  }
}
