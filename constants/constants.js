module.exports = Object.freeze({
  roles: {
    ADMIN: 'admin',
    USER: 'user'
  },
  adminUser: {
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  SALT_WORK_FACTOR: 10,
  PATH_PERMISSIONS: [
    {
      path: '/user',
      method: 'POST',
      roles: ['admin']
    },
    {
      path: '/user',
      method: 'PUT',
      roles: ['admin']
    },
    {
      path: '/user',
      method: 'GET',
      roles: ['admin', 'user']
    },
    {
      path: '/user',
      method: 'DELETE',
      roles: ['admin']
    }
  ]
})
