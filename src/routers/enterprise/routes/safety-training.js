export default {
  name: 'safety-training',
  title: '安全教育培训',
  menus: [{
    moduleName: 'manager-training',
    title: '管理人员培训'
  }, {
    moduleName: 'operator-training',
    title: '作业人员培训'
  }, {
    moduleName: 'external-person-training',
    title: '外来人员培训'
  }, {
    moduleName: 'enterprise-basic-info',
    title: '企业基础信息',
    external: true
  }, {
    moduleName: 'enterprise-compliance',
    title: '企业合规性',
    external: true
  }, {
    moduleName: 'enterprise-staff-certification',
    title: '岗位人员特证',
    external: true
  }, {
    moduleName: 'standing-book',
    title: '台账类',
    external: true
  }, {
    moduleName: 'safety-repository',
    title: '安全知识库',
    external: true
  }]
}
