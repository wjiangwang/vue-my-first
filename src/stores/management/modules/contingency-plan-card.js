import merge from 'lodash/merge'
import request from '@/modules/request'
import listBase from '@/stores/list'
import listCrud from './emergency-rescue-crud'

const baseURL = '/api/v2/emergencyRescue/erDisposalCard'
const list = listBase({ url: baseURL })
const crud= listCrud({ url: baseURL })

export default merge(list,crud,{
  namespaced: true,
  actions:{
    async erEquipmentMaterialAll(){
     return await request.get('/api/v2/emergencyRescue/erEquipmentMaterialAll')
    },
    async loadRisk({}, id) {
      return await request.get('/api/v2/elementArgument/getRiskDetail', {
        params: { riskAssessmentId: id }
      })
    },
  }
})