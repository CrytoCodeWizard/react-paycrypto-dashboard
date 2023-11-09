import PropTypes from 'prop-types';
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { jwtDecode, setSession, isValidToken } from './utils';

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

const STORAGE_KEY = 'access_token';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        // This function below will handle when token is expired
        const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
        tokenExpired(exp);

        const response = await axios.get(endpoints.profile.list);
        console.log("initial user : ", response.data);
        const user = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize]);

  const tokenExpired = useCallback((exp) => {
    // eslint-disable-next-line prefer-const
    let expiredTimer;

    const currentTime = Date.now();

    const timeLeft = exp * 1000 - currentTime;
    console.log("expired time : ", exp, currentTime, timeLeft);
    clearTimeout(expiredTimer);

    expiredTimer = setTimeout(() => {
      enqueueSnackbar('Login Expired!', {
        variant: 'error',
        anchorOrigin: {
          vertical: "right",
          horizontal: "top"
        },
        autoHideDuration: null,
        style: {
          backgroundColor: "white",
          color: "black",
          border: "1px red solid"
        }
      });

      sessionStorage.removeItem('access_token');

      setTimeout(() => {
        window.location.href = paths.auth.jwt.login;
      }, 5000);
    }, timeLeft);

  }, []);

  // LOGIN
  const login = useCallback(async (username, password) => {
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    const response = await axios.post(endpoints.auth.login, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = response.data;

    setSession(access_token);

    const profile = await axios.get(endpoints.profile.list);

    // This function below will handle when token is expired
    const { exp } = jwtDecode(access_token); // ~3 days by minimals server
    tokenExpired(exp);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...profile.data,
          access_token,
        },
      },
    });
  }, [tokenExpired]);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { access_token, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, access_token);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          access_token,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>
    <SnackbarProvider />
    {children}
  </AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
