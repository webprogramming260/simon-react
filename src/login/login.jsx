import React from 'react';
import { useState, useEffect } from 'react';

import { Unauthenticated } from './Unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ onAuthChange }) {
  async function getUser(email) {
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
      return response.json();
    }
    return null;
  }

  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const authChange = (state) => {
    setAuthState(state);
    onAuthChange(state === AuthState.Authenticated);
  };

  // Asynchronously determine if the user is authenticated by calling the service
  useEffect(() => {
    if (userName) {
      async function isAuthenticated(userName) {
        const user = await getUser(userName);
        const state = user?.authenticated
          ? AuthState.Authenticated
          : AuthState.Unauthenticated;
        setAuthState(state);
        onAuthChange(state === AuthState.Authenticated);
      }
      isAuthenticated(userName);
    }
  }, [userName, onAuthChange]);

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div>
        {authState !== AuthState.Unknown && <h1>Welcome to Simon</h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated
            userName={userName}
            onLogout={() => authChange(AuthState.Unauthenticated)}
          />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              setUserName(loginUserName);
              authChange(AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}
