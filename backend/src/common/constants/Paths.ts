
export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Auth: {
    Base: '/auth',
    signup: '/signup',
    login: '/login',
  },
} as const;
