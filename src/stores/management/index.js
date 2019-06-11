import Vue from 'vue'
import Vuex from 'vuex'
import district from '@/stores/modules/district'
import resourceSelect from '@/stores/modules/resource-select'
import cascaderSelect from '@/stores/modules/cascader-select'

import account from './modules/account'
import dashboard from './modules/dashboard'
import enterprise from './modules/enterprise'
import enterpriseUser from './modules/enterprise-user'
import adminUser from './modules/admin-user'
import adminRole from './modules/admin-role'
import policy from './modules/policy'
import training from './modules/training'

import enterpriseSafety from './modules/enterprise-safety'
import enterpriseCertification from './modules/enterprise-certification'
import enterpriseEmployee from './modules/enterprise-employee'
import enterpriseDepartment from './modules/enterprise-department'
import employeeCertificate from './modules/employee-certificate'
import enterpriseRiskAssessment from './modules/enterprise-risk-assessment'
import enterpriseRiskSecondItem from './modules/enterprise-risk-second-item'
import enterpriseRiskThirdItem from './modules/enterprise-risk-third-item'
import enterpriseRiskGrade from './modules/enterprise-risk-grade'

import enterpriseRiskGraph from './modules/enterprise-risk-graph'
import dashboardEnterprise from './modules/dashboard-enterprise'
import enterpriseRiskTrend from './modules/enterprise-risk-trend'
import emap from './modules/emap'
import risk from './modules/risk'
import riskControl from './modules/risk-control'
import hiddenDangerControl from './modules/hidden-danger-control'

//2.0 新增
import contingencyAccidentReport from './modules/contingency-accident-report'
import getDropdownOption from './modules/get-dropdown-option'
import enterpriseRescueTeam from './modules/enterprise-rescue-team'
import enterpriseRescueResource from './modules/enterprise-rescue-resource'
import enterpriseRescueExpert from './modules/enterprise-rescue-expert'
import contingencyPlan from './modules/contingency-plan'
import contingencyPlanCard from './modules/contingency-plan-card'
import managementContingencyPlan from './modules/management-contingency-plan'
import contingencyDrillRecord from './modules/contingency-drill-record'
import contingencyDrillPlan from './modules/contingency-drill-plan'
import contingencyDrillSummary from './modules/contingency-drill-summary'
import repository from './modules/repository'

import majorHazard from './modules/major-hazard'








Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    district,
    resourceSelect,
    cascaderSelect,

    account,
    dashboard,

    enterprise,
    enterpriseUser,
    adminUser,
    adminRole,

    policy,
    training,

    enterpriseSafety,
    enterpriseCertification,
    enterpriseEmployee,
    enterpriseDepartment,
    employeeCertificate,
    enterpriseRiskAssessment,
    enterpriseRiskSecondItem,
    enterpriseRiskThirdItem,
    enterpriseRiskGrade,

    enterpriseRiskGraph,
    dashboardEnterprise,
    enterpriseRiskTrend,
    emap,
    risk,
    riskControl,
    hiddenDangerControl,

    contingencyAccidentReport,
    getDropdownOption,
    enterpriseRescueTeam,
    enterpriseRescueResource,
    enterpriseRescueExpert,
    contingencyPlanCard,
    contingencyPlan,
    managementContingencyPlan,
    contingencyDrillPlan,
    contingencyDrillRecord,
    contingencyDrillSummary,
    repository,

    majorHazard
  }
})
