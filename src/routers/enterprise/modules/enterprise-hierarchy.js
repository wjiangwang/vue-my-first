// 企业配置
import storage from '@/modules/storage'

export default {
  path: 'enterprise-hierarchy',
  redirect: 'enterprise-hierarchy/hierarchy-count',
  component: require('@/pages/enterprise/enterprise-hierarchy/Layout').default,
  children: [
    {
      path: 'hierarchy-count',
      component: require('@/pages/enterprise/enterprise-hierarchy/HierarchyCount').default
    },
    {
      path: 'hierarchies/:hierarchy/jobs',
      component: require('@/pages/enterprise/enterprise-hierarchy/HierarchyJobs').default,
      props: (route) => ({
        hierarchy: parseInt(route.params.hierarchy, 10),
        isRedirect: storage.getIsRedirect()
      })
    },
    {
      path: 'hierarchy-tree',
      component: require('@/pages/enterprise/enterprise-hierarchy/HierarchyTree').default
    }
  ]
}
