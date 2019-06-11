// 设备证照
export default {
  path: 'enterprise-equipment-certification',
  component: require('@/pages/enterprise/basic-info/certifications/Certifications').default,
  props: {
    titleName: '设备证照',
    certificateType: 'EQUIPMENT'
  }
}
