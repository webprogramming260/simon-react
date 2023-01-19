import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bootstrap } from 'bootstrap/dist/js/bootstrap.bundle.min';
import './login.css';

function LoginControls(props) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(props.userName);
  const [password, setPassword] = useState();

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
    const body = await response.json();
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      navigate('/play');
    } else {
      const modalEl = document.querySelector('#msgModal');
      modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
      const msgModal = new bootstrap.Modal(modalEl, {});
      msgModal.show();
    }
  }

  return (
    <div id='loginControls'>
      <div className='input-group mb-3'>
        <span className='input-group-text'>@</span>
        <input
          className='form-control'
          type='text'
          value={props.userName}
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
        className='btn btn-primary'
        onClick={() => createUser()}
      >
        Create
      </button>
    </div>
  );
}

function PlayControls(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => navigate('/'));
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

  const userName = localStorage.getItem('userName');
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
          <PlayControls playerName={userName} />
        ) : (
          <LoginControls playerName={userName} />
        )}
      </div>
      <div className='modal fade' id='msgModal' tabIndex='-1'>
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

// return (
//   <main className='container-fluid bg-secondary text-center'>
//     <div>
//       <h1>Welcome to Simon</h1>
//       <div id='loginControls' style={{ display: 'none' }}>
//         <div className='input-group mb-3'>
//           <span className='input-group-text'>@</span>
//           <input
//             className='form-control'
//             type='text'
//             id='userName'
//             placeholder='your@email.com'
//           />
//         </div>
//         <div className='input-group mb-3'>
//           <span className='input-group-text'>🔒</span>
//           <input
//             className='form-control'
//             type='password'
//             id='userPassword'
//             placeholder='password'
//           />
//         </div>
//         <button
//           type='button'
//           className='btn btn-primary'
//           onClick={() => loginUser()}
//         >
//           Login
//         </button>
//         <button
//           type='button'
//           className='btn btn-primary'
//           onClick={() => createUser()}
//         >
//           Create
//         </button>
//       </div>
//       <div id='playControls' style={{ display: 'none' }}>
//         <div id='playerName'></div>
//         <button
//           type='button'
//           className='btn btn-primary'
//           onClick={() => play()}
//         >
//           Play
//         </button>
//         <button
//           type='button'
//           className='btn btn-secondary'
//           onClick={() => logout()}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//     <div className='modal fade' id='msgModal' tabIndex='-1'>
//       <div className='modal-dialog modal-dialog-centered'>
//         <div className='modal-content text-dark'>
//           <div className='modal-body'>error message here</div>
//           <div className='modal-footer'>
//             <button
//               type='button'
//               className='btn btn-secondary'
//               data-bs-dismiss='modal'
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </main>
// );
