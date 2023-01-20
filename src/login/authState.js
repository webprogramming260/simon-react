export class AuthState {
  static Unknown = new AuthState('unknown');
  static Authenticated = new AuthState('authorized');
  static Unauthenticated = new AuthState('unauthorized');

  constructor(name) {
    this.name = name;
  }
}
