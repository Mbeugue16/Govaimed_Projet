import { setAuthToken } from '../api/endpoint';

export const AUTH_CHANGED_EVENT = 'govaimed-auth-changed';

export const persistUserSession = (token, userProfile) => {
  setAuthToken(token);
  if (userProfile) {
    localStorage.setItem('user', JSON.stringify(userProfile));
  }
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};
