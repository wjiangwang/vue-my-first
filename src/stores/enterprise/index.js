import Vue from 'vue'
import Vuex from 'vuex'

import district from '@/stores/modules/district'
import resourceSelect from '@/stores/modules/resource-select'
import cascaderSelect from '@/stores/modules/cascader-select'

// import risk from '@/stores/management/modules/risk'
// import riskControl from '@/stores/management/modules/risk-control'
// import hiddenDangerControl from '@/stores/management/modules/hidden-danger-control'
// import enterpriseRiskSecondItem from '@/stores/management/modules/enterprise-risk-second-item'
// import enterpriseRiskThirdItem from '@/stores/management/modules/enterprise-risk-third-item'
import employeeCertificate from '@/stores/management/modules/employee-certificate'
// import enterpriseUser from '@/stores/management/modules/enterprise-user'


// -------------------双控概览
import riskDashboard from './modules/risk-lassification-control/risk-dashboard'
// 风险评估
import regionalRisk from './modules/risk-lassification-control/risk-assessment/regional-risk'
import realTimeRisk from './modules/risk-lassification-control/risk-assessment/real-time-risk'
import realTimeRiskThird from './modules/risk-lassification-control/risk-assessment/real-time-risk-third'

import riskSecondItem from './modules/risk-lassification-control/risk-second-item'
import riskThirdItem from './modules/risk-lassification-control/risk-third-item'
// 风险管控台帐
import riskControlLedger from './modules/risk-lassification-control/risk-control-ledger'
// 隐患排查清单
import hiddenInspectList from './modules/risk-lassification-control/hidden-inspect-list'
// 隐患治理台帐
import hiddenCheckControlBook from './modules/risk-lassification-control/check-control-book'

import risk from './modules/risk'
import riskControl from './modules/risk-control'

import hiddenDangerControl from './modules/hidden-danger-control'
import enterpriseUser from './modules/enterprise-user'

import account from './modules/account'
import enterprise from './modules/enterprise'
import enterpriseSafety from './modules/safety'
import enterpriseRiskGraph from './modules/risk-graph'

import enterpriseEmployee from './modules/employee'
import enterpriseCertification from './modules/certification'
import policy from './modules/policy'
import enterpriseRiskTrend from './modules/risk-trend'
import enterpriseRiskGrade from './modules/risk-grade'
import dashboardCarousel from './modules/carousel'
import dashboardNotice from './modules/notice'
import dashboardProgressStatistics from './modules/progress-statistics'
import dashboardRiskStatistics from './modules/risk-statistics'
import dashboardSpecialJobStatistics from './modules/special-job-statistics'

import liaison from './modules/liaison'

import hierarchyCount from './modules/hierarchy-count'
import hierarchyJob from './modules/hierarchy-job'
import hierarchyJobEmployee from './modules/hierarchy-job-employee'
import hierarchyJobRisk from './modules/hierarchy-job-risk'
import hierarchyJobChild from './modules/hierarchy-job-child'
import hierarchyTree from './modules/hierarchy-tree'

// 2.0版本 新增
import majorHazard from './modules/major-hazard/major-hazard'
import majorHazardGraph from './modules/major-hazard/major-hazard-graph'
import securityRepository from './modules/security-repository'

import contingencyDrillRecord from './modules/contingency-drill-record'
import contingencyDrillPlan from './modules/contingency-drill-plan'
import contingencyDrillSummary from './modules/contingency-drill-summary'

import managerTraining from './modules/manager-training'
import dashboard from './modules/dashboard'
import contingencyPlan from './modules/contingency-plan'
import getDropdownOption from './modules/get-dropdown-option'
import contingencyPlanCard from './modules/contingency-plan-card'
import enterpriseRescueTeam from './modules/enterprise-rescue-team'
import enterpriseRescueResource from './modules/enterprise-rescue-resource'
import enterpriseRescueExpert from './modules/enterprise-rescue-expert'
import contingencyAccidentReport from './modules/contingency-accident-report'
import contingencyAccidentStatistics from './modules/contingency-accident-statistics'
import emergencyRescueMap from './modules/emergency-rescue/emergency-rescue-map'
import monitorGraph from './modules/monitor-graph'
import contingencyPlanCardNew from './modules/contingency-plan-card-new'

// 后期移除
import enterpriseRiskSecondItem from './modules/enterprise-risk-second-item'
import enterpriseRiskThirdItem from './modules/enterprise-risk-third-item'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    district,
    resourceSelect,
    cascaderSelect,

    risk,
    riskControl,

    riskDashboard,
    regionalRisk,
    realTimeRisk,
    realTimeRiskThird,
    riskSecondItem,
    riskThirdItem,
    riskControlLedger,
    hiddenInspectList,
    hiddenCheckControlBook,

    hiddenDangerControl,

    account,
    policy,
    enterprise,
    enterpriseSafety,
    enterpriseRiskGraph,
    enterpriseEmployee,
    enterpriseCertification,
    enterpriseRiskTrend,
    enterpriseRiskGrade,

    employeeCertificate,
    enterpriseUser,

    dashboardCarousel,
    dashboardNotice,
    dashboardProgressStatistics,
    dashboardRiskStatistics,
    dashboardSpecialJobStatistics,

    liaison,

    hierarchyCount,
    hierarchyJob,
    hierarchyJobEmployee,
    hierarchyJobRisk,
    hierarchyJobChild,
    hierarchyTree,

    majorHazard,
    majorHazardGraph,
    securityRepository,

    contingencyDrillPlan,
    contingencyDrillRecord,
    contingencyDrillSummary,

    managerTraining,
    dashboard,
    contingencyPlan,
    getDropdownOption,
    contingencyPlanCard,
    enterpriseRescueTeam,
    enterpriseRescueResource,
    enterpriseRescueExpert,
    contingencyAccidentReport,
    contingencyAccidentStatistics,
    emergencyRescueMap,
    monitorGraph,
    contingencyPlanCardNew,

    // 后期移除
    enterpriseRiskSecondItem,
    enterpriseRiskThirdItem
  }
})
