<template>
  <div class="admin-volunteer tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">志愿者管理</span>
      <span class="tech-subtitle">管理志愿者信息，审核志愿者申请</span>
    </div>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon"><User /></el-icon>
            志愿者列表
          </span>
          <el-button type="primary" class="tech-btn" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加志愿者
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入志愿者姓名" class="tech-input">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" class="tech-select">
            <el-option label="全部状态" value="" />
            <el-option label="待审核" value="pending">
              <el-icon class="option-icon"><Clock /></el-icon>
              待审核
            </el-option>
            <el-option label="已通过" value="approved">
              <el-icon class="option-icon"><CircleCheck /></el-icon>
              已通过
            </el-option>
            <el-option label="已拒绝" value="rejected">
              <el-icon class="option-icon"><CircleClose /></el-icon>
              已拒绝
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="tech-btn search-btn" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button class="reset-btn" @click="resetSearch">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 统计卡片 -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon pending">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingCount || 0 }}</div>
            <div class="stat-label">待审核</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon approved">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.approvedCount || 0 }}</div>
            <div class="stat-label">已通过</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalCount || 0 }}</div>
            <div class="stat-label">志愿者总数</div>
          </div>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%" class="tech-table" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" align="center">
          <template #default="scope">
            <span class="id-badge">#{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="32" class="user-avatar">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <span class="user-name">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="email" label="邮箱" width="200" show-overflow-tooltip />
        <el-table-column prop="skills" label="技能特长" width="150" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-if="scope.row.skills" size="small" class="skill-tag">
              {{ scope.row.skills }}
            </el-tag>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" class="status-tag" effect="dark">
              <el-icon v-if="scope.row.status === 'pending'"><Clock /></el-icon>
              <el-icon v-else-if="scope.row.status === 'approved'"><CircleCheck /></el-icon>
              <el-icon v-else><CircleClose /></el-icon>
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="180">
          <template #default="scope">
            <div class="time-info">
              <el-icon><Calendar /></el-icon>
              {{ scope.row.createTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <div class="action-btns">
              <el-button size="small" class="action-btn view-btn" @click="handleView(scope.row.id)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button
                v-if="scope.row.status === 'pending'"
                size="small"
                type="primary"
                class="action-btn approve-btn"
                @click="handleApprove(scope.row.id)"
              >
                <el-icon><Check /></el-icon>
                审核
              </el-button>
              <el-button size="small" type="warning" class="action-btn edit-btn" @click="handleEdit(scope.row.id)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" class="action-btn delete-btn" @click="handleDelete(scope.row.id)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="pagination.total > 0"
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="tech-pagination"
      />

      <!-- 空状态 -->
      <div v-if="tableData.length === 0 && !loading" class="empty-state">
        <el-icon class="empty-icon"><User /></el-icon>
        <p>暂无志愿者数据</p>
        <el-button type="primary" class="tech-btn" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加志愿者
        </el-button>
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog v-model="approveDialogVisible" title="审核志愿者" width="500px" class="tech-dialog" destroy-on-close>
      <div class="dialog-content">
        <el-form :model="approveForm" :rules="approveRules" ref="approveFormRef" label-width="100px">
          <el-form-item label="审核结果" prop="result">
            <el-radio-group v-model="approveForm.result" class="approve-radio-group">
              <el-radio label="approved" class="approve-radio">
                <el-icon class="radio-icon success"><CircleCheck /></el-icon>
                <span>通过</span>
              </el-radio>
              <el-radio label="rejected" class="approve-radio">
                <el-icon class="radio-icon danger"><CircleClose /></el-icon>
                <span>拒绝</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="comments">
            <el-input
              type="textarea"
              v-model="approveForm.comments"
              placeholder="请输入审核意见"
              :rows="4"
              class="tech-textarea"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="approveDialogVisible = false" class="cancel-btn">取消</el-button>
          <el-button type="primary" class="tech-btn" @click="submitApprove">
            <el-icon><Check /></el-icon>
            提交审核
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getVolunteerList, approveVolunteer, deleteVolunteer, getVolunteerStats } from '@/api/admin/volunteer'
import {
  User, Plus, Search, RefreshRight, Clock, CircleCheck, CircleClose,
  UserFilled, Calendar, View, Check, Edit, Delete
} from '@element-plus/icons-vue'

const router = useRouter()
const tableData = ref([])
const loading = ref(false)
const stats = ref({})
const searchForm = reactive({
  name: '',
  status: ''
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
  comments: ''
})

const approveRules = {
  result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
  comments: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
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
    case 'pending': return '待审核'
    case 'approved': return '已通过'
    case 'rejected': return '已拒绝'
    default: return status
  }
}

const loadStats = async () => {
  try {
    const response = await getVolunteerStats()
    stats.value = response.data || {}
  } catch (error) {
    console.error('获取统计数据失败', error)
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const response = await getVolunteerList({
      ...searchForm,
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    tableData.value = response.rows
    pagination.total = response.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = ''
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
  router.push('/admin/volunteer/add')
}

const handleView = (id) => {
  router.push(`/admin/volunteer/detail/${id}`)
}

const handleEdit = (id) => {
  router.push(`/admin/volunteer/edit/${id}`)
}

const handleApprove = (id) => {
  currentApproveId.value = id
  approveForm.result = ''
  approveForm.comments = ''
  approveDialogVisible.value = true
}

const submitApprove = async () => {
  if (!approveFormRef.value) return
  await approveFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await approveVolunteer(currentApproveId.value, approveForm)
        ElMessage.success('审核成功')
        approveDialogVisible.value = false
        loadData()
        loadStats()
      } catch (error) {
        ElMessage.error('审核失败')
      }
    }
  })
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该志愿者吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteVolunteer(id)
    ElMessage.success('删除成功')
    loadData()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadData()
  loadStats()
})
</script>

<style scoped>
.admin-volunteer {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.15);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon.pending {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.4) 100%);
  color: #f59e0b;
}

.stat-icon.approved {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.4) 100%);
  color: #10b981;
}

.stat-icon.total {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(124, 58, 237, 0.4) 100%);
  color: #00d4ff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--tech-text-secondary);
  margin-top: 4px;
}

/* 表格样式 */
.id-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #00d4ff;
  font-family: 'Courier New', monospace;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
}

.user-name {
  font-weight: 500;
}

.skill-tag {
  background: rgba(124, 58, 237, 0.2);
  border-color: rgba(124, 58, 237, 0.4);
  color: #a78bfa;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--tech-text-secondary);
}

.time-info .el-icon {
  color: #00d4ff;
}

.action-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.view-btn {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.3);
  color: #00d4ff;
}

.view-btn:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
}

.approve-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
}

.edit-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
}

/* 审核对话框 */
.dialog-content {
  padding: 20px 0;
}

.approve-radio-group {
  display: flex;
  gap: 24px;
}

.approve-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  transition: all 0.3s ease;
}

.approve-radio:hover {
  border-color: rgba(0, 212, 255, 0.5);
  background: rgba(0, 212, 255, 0.05);
}

.approve-radio.is-checked {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
}

.radio-icon {
  font-size: 20px;
}

.radio-icon.success {
  color: #10b981;
}

.radio-icon.danger {
  color: #ef4444;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn:hover {
  border-color: #00d4ff;
  color: #00d4ff;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }

  .action-btns {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
