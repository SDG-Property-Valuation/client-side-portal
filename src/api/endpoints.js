export const API_ENDPOINTS = {
  auth: {
    initializeSignup: '/api/v1/auth/initialize-signup',
    verifySignup: '/api/v1/auth/verify-signup',
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    session: '/api/v1/auth/me',
    refresh: '/api/v1/auth/refresh-auth',
    logout: {
      client: '/api/v1/client/client-logout',
      banker: '/api/v1/bank/banker-logout',
    },
  },
  inspections: {
    request: '/api/v1/inspections/request',
    detail: '/api/v1/inspections',
  },
}
