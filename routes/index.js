/**
 * This file has all path and associated express route. app.js loads path and
 * routes
 */

const routes = [
  {
    path: '/',
    route: require('./app/index')
  },
  {
    path: '/api/version',
    route: require('./api/versionRoute')
  },
  {
    path: '/api/user',
    route: require('./api/userRoutes')
  },
  {
    path: '/healthCheck',
    route: require('./health/healthCheckRoutes')
  }
]

module.exports = {
  httpsRoutes: () => {
    return routes
  }
}
