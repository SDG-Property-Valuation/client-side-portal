export const API_ENDPOINTS = {
  client: {
    register: '/api/v1/client/register-client',
    login: '/api/v1/client/client-login',
    requestValuation: '/api/v1/client/request-valuation',
    requestedInspections: '/api/v1/client/get-requested-inspections',
    cancelRequestedInspections: '/api/v1/client/cancel-requested-inspections',
    auth: {
      session: '/api/v1/client/me',
      refresh: '/api/v1/client/refresh-auth',
      logout: '/api/v1/client/client-logout',
    },
  },
  bank: {
    register: '/api/v1/bank/register-bank',
    login: '/api/v1/bank/banker-login',
    auth: {
      session: '/api/v1/bank/me',
      refresh: '/api/v1/bank/refresh-auth',
      logout: '/api/v1/bank/banker-logout',
    },
  },
}
