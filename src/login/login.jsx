import React from 'react';
import { useState, useEffect } from 'react';

import { Unauthenticated } from './Unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login() {
  async function getUser(email) {
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
      return response.json();
    }
    return null;
  }

  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));

  // Asynchronously determine if the user is authenticated by calling the service
  useEffect(() => {
    if (userName) {
      async function isAuthenticated(userName) {
        const user = await getUser(userName);
        setAuthState(
          user?.authenticated
            ? AuthState.Authenticated
            : AuthState.Unauthenticated
        );
      }
      isAuthenticated(userName);
    }
  }, [userName]);

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div>
        {authState !== AuthState.Unknown && <h1>Welcome to Simon</h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated
            userName={userName}
            onLogout={() => setAuthState(AuthState.Unauthenticated)}
          />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              setUserName(loginUserName);
              setAuthState(AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}
