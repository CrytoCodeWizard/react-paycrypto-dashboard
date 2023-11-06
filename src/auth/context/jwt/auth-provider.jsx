import PropTypes from 'prop-types';
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';
// import { useSnackbar } from 'src/components/snackbar';

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

// ----------------------------------------------------------------------

const STORAGE_KEY = 'access_token';

export function AuthProvider({ children }) {
  // const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);

  const tokenExpired = useCallback((exp) => {
    // eslint-disable-next-line prefer-const
    let expiredTimer;

    const currentTime = Date.now();

    // Test token expires after 10s
    // const timeLeft = currentTime + 10000 - currentTime; // ~10s
    const timeLeft = exp * 1000 - currentTime;
    console.log('left time', timeLeft);
    clearTimeout(expiredTimer);

    expiredTimer = setTimeout(() => {
      enqueueSnackbar('Token expired, Go to login Page!', {
        variant: 'error',
        anchorOrigin: {
          vertical: "center",
          horizontal: "center"
        },
        autoHideDuration: null
      });

      sessionStorage.removeItem('access_token');

      // window.location.href = paths.auth.jwt.login;
    }, timeLeft);
  }, []);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        // This function below will handle when token is expired
        const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
        tokenExpired(exp);

        const response = await axios.get(endpoints.auth.me);

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
  }, [tokenExpired]);

  useEffect(() => {
    initialize();
  }, [initialize]);

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

    const { access_token, user } = response.data;

    setSession(access_token);
    // This function below will handle when token is expired
    const { exp } = jwtDecode(access_token); // ~3 days by minimals server
    tokenExpired(exp);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...user,
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
