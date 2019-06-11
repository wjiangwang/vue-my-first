import Vue from 'vue'
import Vuex from 'vuex'

import district from '@/stores/modules/district'
import resourceSelect from '@/stores/modules/resource-select'
import cascaderSelect from '@/stores/modules/cascader-select'

import account from './modules/account'
import dashboard from './modules/dashboard'
import dashboardEnterprise from './modules/dashboard-enterprise'
import enterpriseRiskTrend from './modules/enterprise-risk-trend'
import emap from './modules/emap'
import enterpriseRiskGraph from './modules/enterprise-risk-graph'
import risk from './modules/risk'
import riskControl from './modules/risk-control'
import hiddenDangerControl from './modules/hidden-danger-control'
import enterprise from './modules/enterprise'

import enterpriseSafety from '@/stores/management/modules/enterprise-safety'
import enterpriseCertification from '@/stores/management/modules/enterprise-certification'
import enterpriseEmployee from '@/stores/management/modules/enterprise-employee'
import enterpriseDepartment from '@/stores/management/modules/enterprise-department'
import enterpriseRiskAssessment from '@/stores/management/modules/enterprise-risk-assessment'
import enterpriseRiskGrade from '@/stores/management/modules/enterprise-risk-grade'
import employeeCertificate from '@/stores/management/modules/employee-certificate'
import enterpriseRiskSecondItem from '@/stores/management/modules/enterprise-risk-second-item'
import enterpriseRiskThirdItem from '@/stores/management/modules/enterprise-risk-third-item'

import majorHazard from './modules/major-hazard'
import getDropdownOption from './modules/get-dropdown-option'
import contingencyPlanCard from './modules/contingency-plan-card'


// import enterpriseRiskThirdItem from '@/stores/management/modules/enterpriseRiskThirdItem'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    district,
    resourceSelect,
    cascaderSelect,

    account,
    dashboard,
    dashboardEnterprise,
    enterpriseRiskTrend,
    emap,
    enterpriseRiskGraph,
    risk,
    riskControl,
    hiddenDangerControl,
    enterprise,

    enterpriseSafety,
    enterpriseCertification,
    enterpriseEmployee,
    enterpriseDepartment,
    enterpriseRiskAssessment,
    enterpriseRiskGrade,
    employeeCertificate,
    enterpriseRiskSecondItem,
    enterpriseRiskThirdItem,

    majorHazard,
    getDropdownOption,
    contingencyPlanCard
  }
})
