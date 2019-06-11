// 岗位人员特证
export default {
  path: 'enterprise-staff-certification',
  component: require('@/pages/enterprise/basic-info/certifications/Certifications').default,
  props: {
    titleName: '岗位人员特证',
    certificateType: 'PERSONAL'
  }
}
