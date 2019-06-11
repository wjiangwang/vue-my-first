'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"staging"',
  BAIDU_MAP_APP_KEY: '"mNLQz4KI0tYMPH3XxWpPaebqmD4SCGZn"',
  MANAGEMENT_BASE_URL: '"http://api.staging.sccitysafety.com"',
  ENTERPRISE_BASE_URL: '"http://api.staging.e.sccitysafety.com"',
  GROUP_BASE_URL: '"http://api.staging.g.sccitysafety.com"'
})
