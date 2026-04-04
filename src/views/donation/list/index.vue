<template>
  <div class="donation-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>物资捐赠列表</span>
          <el-button type="primary" @click="handleAdd">新增捐赠</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" class="mb-4">
        <el-form-item label="捐赠状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="捐赠人">
          <el-input v-model="searchForm.donorName" placeholder="请输入捐赠人姓名" />
        </el-form-item>
        <el-form-item label="捐赠类型">
          <el-select v-model="searchForm.donationType" placeholder="请选择捐赠类型">
            <el-option label="食品" value="food" />
            <el-option label="用品" value="supplies" />
            <el-option label="药品" value="medicine" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="捐赠编号" width="100" />
        <el-table-column prop="donorName" label="捐赠人" width="120" />
        <el-table-column prop="contactPhone" label="联系电话" width="150" />
        <el-table-column prop="donationType" label="捐赠类型" width="100">
          <template #default="scope">
            {{ getDonationTypeText(scope.row.donationType) }}
          </template>
        </el-table-column>
        <el-table-column prop="donationMethod" label="捐赠方式" width="120" />
        <el-table-column prop="donationTime" label="捐赠时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row.id)">查看</el-button>
            <el-button size="small" type="success" @click="handleConfirm(scope.row.id)" v-if="scope.row.status === 'pending'">确认收到</el-button>
            <el-button size="small" type="danger" @click="handleCancel(scope.row.id)" v-if="scope.row.status === 'pending'">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getDonationList, confirmDonation, cancelDonation } from '@/api/donation/application'

const router = useRouter()
const tableData = ref([])
const searchForm = reactive({
  status: '',
  donorName: '',
  donationType: ''
})
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'confirmed': return 'success'
    case 'cancelled': return 'danger'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待确认'
    case 'confirmed': return '已确认'
    case 'cancelled': return '已取消'
    default: return status
  }
}

const getDonationTypeText = (type) => {
  switch (type) {
    case 'food': return '食品'
    case 'supplies': return '用品'
    case 'medicine': return '药品'
    case 'other': return '其他'
    default: return type
  }
}

const loadData = async () => {
  try {
    const response = await getDonationList({
      ...searchForm,
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    tableData.value = response.rows
    pagination.total = response.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const resetSearch = () => {
  searchForm.status = ''
  searchForm.donorName = ''
  searchForm.donationType = ''
  pagination.current = 1
  loadData()
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadData()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  loadData()
}

const handleAdd = () => {
  router.push('/donation/application')
}

const handleView = (id) => {
  router.push(`/donation/detail/${id}`)
}

const handleConfirm = async (id) => {
  try {
    await confirmDonation(id)
    ElMessage.success('确认成功')
    loadData()
  } catch (error) {
    ElMessage.error('确认失败')
  }
}

const handleCancel = async (id) => {
  try {
    await cancelDonation(id)
    ElMessage.success('取消成功')
    loadData()
  } catch (error) {
    ElMessage.error('取消失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.donation-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>