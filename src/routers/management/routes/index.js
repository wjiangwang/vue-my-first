export default [
  'dashboard',
  'risk-gis',
  'enterprise-archive',
  'major-hazard',
  'emergency-rescue',
  'safety-training',
  'enforcement',
  'safety-repository',
  'monitoring',
  'setting',
  'policy'
].map(name => {
  return require(`./${name}`).default
})
