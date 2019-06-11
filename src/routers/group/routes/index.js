export default [
  'dashboard',
  'risk-gis',
  'enterprise-archive',
  'major-hazard'
].map(name => {
  return require(`./${name}`).default
})
