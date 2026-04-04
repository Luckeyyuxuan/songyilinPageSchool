<template>
  <div class="adoption-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>领养申请列表</span>
          <el-button type="primary" @click="handleAdd">新增申请</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" class="mb-4">
        <el-form-item label="申请状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="待审批" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="searchForm.applicantName" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="申请编号" width="100" />
        <el-table-column prop="applicantName" label="申请人" width="120" />
        <el-table-column prop="contactPhone" label="联系电话" width="150" />
        <el-table-column prop="housingType" label="住房类型" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row.id)">查看</el-button>
            <el-button size="small" type="primary" @click="handleApprove(scope.row.id)" v-if="scope.row.status === 'pending'">审批</el-button>
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
    
    <!-- 审批对话框 -->
    <el-dialog v-model="approveDialogVisible" title="审批领养申请" width="500px">
      <el-form :model="approveForm" :rules="approveRules" ref="approveFormRef" label-width="100px">
        <el-form-item label="审批结果" prop="result">
          <el-radio-group v-model="approveForm.result">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="comments">
          <el-input type="textarea" v-model="approveForm.comments" placeholder="请输入审批意见" />
        </el-form-item>
        <el-form-item label="押金金额" prop="deposit" v-if="approveForm.result === 'approved'">
          <el-input v-model="approveForm.deposit" placeholder="请输入押金金额" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="approveDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApprove">提交审批</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getAdoptionList, approveAdoption } from '@/api/adoption/application'

const router = useRouter()
const tableData = ref([])
const searchForm = reactive({
  status: '',
  applicantName: ''
})
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const approveDialogVisible = ref(false)
const approveFormRef = ref()
const currentApproveId = ref()
const approveForm = reactive({
  result: '',
  comments: '',
  deposit: 0
})

const approveRules = {
  result: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  comments: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
  deposit: [{ required: true, message: '请输入押金金额', trigger: 'blur' }, { type: 'number', min: 0, message: '押金金额必须大于等于0', trigger: 'blur' }]
}

const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'approved': return 'success'
    case 'rejected': return 'danger'
    default: return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '待审批'
    case 'approved': return '已通过'
    case 'rejected': return '已拒绝'
    default: return status
  }
}

const loadData = async () => {
  try {
    const response = await getAdoptionList({
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
  searchForm.applicantName = ''
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
  router.push('/adoption/application')
}

const handleView = (id) => {
  router.push(`/adoption/detail/${id}`)
}

const handleApprove = (id) => {
  currentApproveId.value = id
  approveForm.result = ''
  approveForm.comments = ''
  approveForm.deposit = 0
  approveDialogVisible.value = true
}

const submitApprove = async () => {
  if (!approveFormRef.value) return
  await approveFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await approveAdoption(currentApproveId.value, approveForm)
        ElMessage.success('审批成功')
        approveDialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error('审批失败')
      }
    }
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.adoption-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  text-align: right;
}
</style>