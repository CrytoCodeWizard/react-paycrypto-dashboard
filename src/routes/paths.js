const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    profile: `${ROOTS.DASHBOARD}/profile`,
    address: `${ROOTS.DASHBOARD}/address`,
    transaction: `${ROOTS.DASHBOARD}/transaction`,
    withdraw: `${ROOTS.DASHBOARD}/withdraw`,
    cashout: `${ROOTS.DASHBOARD}/cashout`,
    user: `${ROOTS.DASHBOARD}/user`,
  },
};
