<template>
  <div class="page">
    <breadcrumb :items="[{ name: '导入设置' }]"></breadcrumb>

    <div class="page-main">
      <page-card>
        <div class="title">导入文件特殊符号对照表</div>

        <el-table :data="tableData" border style="width: 700px">
          <el-table-column prop="identity"
            label="匹配标识"
            width="140px">
          </el-table-column>
          <el-table-column prop="color"
            label="颜色值"
            width="140px">
            <template slot-scope="{ row }">
              <span :style="`color: ${row.color}`">{{row.color}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark"
            label="备注">
          </el-table-column>
        </el-table>
      </page-card>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PageCard from '@/components/PageCard'

const tableData = [
  {
    identity: '#',
    color: '#37A9FA',
    remark: '首页为“#”的内容字体为蓝色'
  },
  {
    identity: '$',
    color: '#FA5878',
    remark: '首页为“$”的内容字体为红色'
  },
  {
    identity: '低风险',
    color: '#37A9FA',
    remark: '风险级别完全匹配低风险字体为蓝色'
  },
  {
    identity: '未',
    color: '#999999',
    remark: '现有管理措施下5列以“未”字开头自动识别为灰色'
  }
]

export default {
  name: 'ImportSheet',

  components: {
    Breadcrumb,
    PageCard
  },

  data() {
    return {
      tableData: tableData
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  line-height: 20px;
  color: #333333;
  margin-bottom: 15px;
  font-weight: 600;
}
</style>
