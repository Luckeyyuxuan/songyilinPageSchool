<template>
  <div class="complaint-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">投诉举报管理</span>
      <span class="tech-subtitle">管理用户投诉举报记录、处理流程及结果反馈</span>
    </div>

    <el-card shadow="hover" class="tech-card search-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon"><Search /></el-icon>
            搜索条件
          </span>
        </div>
      </template>
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="100px" class="search-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="举报人ID" prop="reportUserId">
              <el-input
                v-model="queryParams.reportUserId"
                placeholder="请输入举报人ID"
                clearable
                @keyup.enter="handleQuery"
                class="tech-input"
              >
                <template #prefix><el-icon><User /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="举报对象类型" prop="targetType">
              <el-select v-model="queryParams.targetType" placeholder="请选择举报对象类型" clearable class="tech-select">
                <el-option
                  v-for="dict in tsjb"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="举报对象ID" prop="targetId">
              <el-input
                v-model="queryParams.targetId"
                placeholder="请输入举报对象ID"
                clearable
                @keyup.enter="handleQuery"
                class="tech-input"
              >
                <template #prefix><el-icon><Document /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="投诉类型" prop="complaintType">
              <el-select v-model="queryParams.complaintType" placeholder="请选择投诉类型" clearable class="tech-select">
                <el-option
                  v-for="dict in afds"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="是否匿名" prop="isAnonymous">
              <el-select v-model="queryParams.isAnonymous" placeholder="请选择是否匿名" clearable class="tech-select">
                <el-option
                  v-for="dict in sfnm"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="处理状态" prop="handleStatus">
              <el-select v-model="queryParams.handleStatus" placeholder="请选择处理状态" clearable class="tech-select">
                <el-option
                  v-for="dict in dansjd"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="处理人ID" prop="handleUserId">
              <el-input
                v-model="queryParams.handleUserId"
                placeholder="请输入处理人ID"
                clearable
                @keyup.enter="handleQuery"
                class="tech-input"
              >
                <template #prefix><el-icon><UserFilled /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="处理时间" prop="handleTime">
              <el-date-picker clearable
                v-model="queryParams.handleTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择处理时间"
                class="tech-date-picker">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="16" :lg="12">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery" class="tech-btn tech-btn-primary">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery" class="tech-btn">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon"><Warning /></el-icon>
            投诉举报列表
          </span>
          <div class="header-actions">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['ComplaintReport:ComplaintReport:add']"
              class="tech-btn tech-btn-primary"
            >新增</el-button>
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['ComplaintReport:ComplaintReport:edit']"
              class="tech-btn tech-btn-success"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['ComplaintReport:ComplaintReport:remove']"
              class="tech-btn tech-btn-danger"
            >删除</el-button>
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['ComplaintReport:ComplaintReport:export']"
              class="tech-btn tech-btn-warning"
            >导出</el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="ComplaintReportList" @selection-change="handleSelectionChange" class="tech-table" stripe>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="complaintId" width="80" />
        <el-table-column label="举报人ID" align="center" prop="reportUserId" width="100" />
        <el-table-column label="举报对象类型" align="center" prop="targetType" width="120">
          <template #default="scope">
            <el-tag :type="getTargetTypeColor(scope.row.targetType)" effect="dark" size="small">
              <dict-tag :options="tsjb" :value="scope.row.targetType"/>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="举报对象ID" align="center" prop="targetId" width="100" />
        <el-table-column label="投诉类型" align="center" prop="complaintType" width="120">
          <template #default="scope">
            <el-tag :type="getComplaintTypeColor(scope.row.complaintType)" effect="dark" size="small">
              <dict-tag :options="afds" :value="scope.row.complaintType"/>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="投诉内容" align="center" prop="complaintContent" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <div class="complaint-content" v-html="scope.row.complaintContent"></div>
          </template>
        </el-table-column>
        <el-table-column label="证据URL" align="center" prop="evidenceUrl" width="120" show-overflow-tooltip />
        <el-table-column label="是否匿名" align="center" prop="isAnonymous" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.isAnonymous === '1' ? 'warning' : 'info'" effect="dark" size="small">
              <dict-tag :options="sfnm" :value="scope.row.isAnonymous"/>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" align="center" prop="handleStatus" width="100">
          <template #default="scope">
            <el-tag :type="getHandleStatusColor(scope.row.handleStatus)" effect="dark" size="small">
              <dict-tag :options="dansjd" :value="scope.row.handleStatus"/>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理人ID" align="center" prop="handleUserId" width="100" />
        <el-table-column label="处理结果" align="center" prop="handleRemark" min-width="150" show-overflow-tooltip />
        <el-table-column label="处理时间" align="center" prop="handleTime" width="160">
          <template #default="scope">
            <span class="time-text">{{ parseTime(scope.row.handleTime, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ComplaintReport:ComplaintReport:edit']">修改</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ComplaintReport:ComplaintReport:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog :title="title" v-model="open" width="700px" append-to-body class="tech-dialog">
      <el-form ref="ComplaintReportRef" :model="form" :rules="rules" label-width="110px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="举报人ID" prop="reportUserId">
              <el-input v-model="form.reportUserId" placeholder="请输入举报人ID" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="举报对象类型" prop="targetType">
              <el-select v-model="form.targetType" placeholder="请选择举报对象类型" class="tech-select">
                <el-option
                  v-for="dict in tsjb"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="举报对象ID" prop="targetId">
              <el-input v-model="form.targetId" placeholder="请输入举报对象ID" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉类型" prop="complaintType">
              <el-select v-model="form.complaintType" placeholder="请选择投诉类型" class="tech-select">
                <el-option
                  v-for="dict in afds"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="投诉内容" prop="complaintContent">
              <editor v-model="form.complaintContent" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证据图片/文件URL" prop="evidenceUrl">
              <el-input v-model="form.evidenceUrl" type="textarea" placeholder="请输入内容" class="tech-textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否匿名" prop="isAnonymous">
              <el-radio-group v-model="form.isAnonymous">
                <el-radio
                  v-for="dict in sfnm"
                  :key="dict.value"
                  :label="parseInt(dict.value)"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理状态" prop="handleStatus">
              <el-select v-model="form.handleStatus" placeholder="请选择处理状态" class="tech-select">
                <el-option
                  v-for="dict in dansjd"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理人ID" prop="handleUserId">
              <el-input v-model="form.handleUserId" placeholder="请输入处理人ID" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理时间" prop="handleTime">
              <el-date-picker clearable
                v-model="form.handleTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择处理时间"
                class="tech-date-picker">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理结果" prop="handleRemark">
              <el-input v-model="form.handleRemark" type="textarea" placeholder="请输入内容" class="tech-textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" class="tech-btn tech-btn-primary">确 定</el-button>
          <el-button @click="cancel" class="tech-btn cancel-btn">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ComplaintReport">
import { listComplaintReport, getComplaintReport, delComplaintReport, addComplaintReport, updateComplaintReport } from "@/api/ComplaintReport/ComplaintReport"
import { ref, reactive, toRefs, getCurrentInstance } from 'vue'
import Editor from "@/components/Editor/index.vue"
import Pagination from "@/components/Pagination/index.vue"
import RightToolbar from "@/components/RightToolbar/index.vue"
import DictTag from "@/components/DictTag/index.vue"
import { parseTime } from "@/utils/ruoyi"

const { proxy } = getCurrentInstance()
const { dansjd, tsjb, afds, sfnm } = proxy.useDict('dansjd', 'tsjb', 'afds', 'sfnm')

const ComplaintReportList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    reportUserId: null,
    targetType: null,
    targetId: null,
    complaintType: null,
    complaintContent: null,
    evidenceUrl: null,
    isAnonymous: null,
    handleStatus: null,
    handleUserId: null,
    handleRemark: null,
    handleTime: null,
    isDeleted: null
  },
  rules: {
    reportUserId: [
      { required: true, message: "举报人ID不能为空", trigger: "blur" }
    ],
    targetType: [
      { required: true, message: "举报对象类型不能为空", trigger: "change" }
    ],
    targetId: [
      { required: true, message: "举报对象ID不能为空", trigger: "blur" }
    ],
    complaintType: [
      { required: true, message: "投诉类型不能为空", trigger: "change" }
    ],
    complaintContent: [
      { required: true, message: "投诉内容不能为空", trigger: "blur" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listComplaintReport(queryParams.value).then(response => {
    ComplaintReportList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    complaintId: null,
    reportUserId: null,
    targetType: null,
    targetId: null,
    complaintType: null,
    complaintContent: null,
    evidenceUrl: null,
    isAnonymous: null,
    handleStatus: null,
    handleUserId: null,
    handleRemark: null,
    handleTime: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  }
  proxy.resetForm("ComplaintReportRef")
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.complaintId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = "添加投诉举报"
}

function handleUpdate(row) {
  reset()
  const _complaintId = row.complaintId || ids.value
  getComplaintReport(_complaintId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改投诉举报"
  })
}

function submitForm() {
  proxy.$refs["ComplaintReportRef"].validate(valid => {
    if (valid) {
      if (form.value.complaintId != null) {
        updateComplaintReport(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addComplaintReport(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

function handleDelete(row) {
  const _complaintIds = row.complaintId || ids.value
  proxy.$modal.confirm('是否确认删除投诉举报编号为"' + _complaintIds + '"的数据项？').then(function() {
    return delComplaintReport(_complaintIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

function handleExport() {
  proxy.download('ComplaintReport/ComplaintReport/export', {
    ...queryParams.value
  }, `ComplaintReport_${new Date().getTime()}.xlsx`)
}

function getTargetTypeColor(type) {
  const colorMap = {
    '0': 'primary',
    '1': 'success',
    '2': 'warning'
  }
  return colorMap[type] || 'info'
}

function getComplaintTypeColor(type) {
  const colorMap = {
    '0': 'danger',
    '1': 'warning',
    '2': 'info'
  }
  return colorMap[type] || 'info'
}

function getHandleStatusColor(status) {
  const colorMap = {
    '0': 'info',
    '1': 'warning',
    '2': 'success',
    '3': 'danger'
  }
  return colorMap[status] || 'info'
}

getList()
</script>

<style scoped lang="scss">
.complaint-page {
  padding: 24px;
  min-height: calc(100vh - 84px);
  background: linear-gradient(135deg, #0a0e27 0%, #111936 100%);
}

.tech-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  
  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 8px;
  }
  
  .tech-subtitle {
    font-size: 14px;
    color: #64748b;
    font-weight: 400;
  }
}

.tech-card {
  background: rgba(17, 25, 54, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 212, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00d4ff, #7c3aed);
    opacity: 0.9;
  }
  
  :deep(.el-card__header) {
    background: linear-gradient(90deg, rgba(0, 212, 255, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%);
    border-bottom: 1px solid rgba(0, 212, 255, 0.15);
    padding: 16px 20px;
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
  
  &:hover {
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 4px 25px rgba(0, 212, 255, 0.15);
  }
}

.search-card {
  margin-bottom: 20px;
  
  :deep(.el-card__body) {
    background: rgba(30, 39, 70, 0.3);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
  
  .title-icon {
    color: #7c3aed;
    font-size: 20px;
  }
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-form {
  .el-form-item {
    margin-bottom: 18px;
    
    :deep(.el-form-item__label) {
      color: #94a3b8;
      font-weight: 500;
    }
  }
}

.tech-input {
  :deep(.el-input__wrapper) {
    background: rgba(30, 39, 70, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.25);
    box-shadow: none;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(0, 212, 255, 0.5);
      box-shadow: 0 0 8px rgba(0, 212, 255, 0.1);
    }
    
    &.is-focus {
      border-color: #00d4ff;
      box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15), 0 0 12px rgba(0, 212, 255, 0.2);
    }
  }
  
  :deep(.el-input__inner) {
    color: #e2e8f0;
    font-weight: 500;
    
    &::placeholder {
      color: #64748b;
    }
  }
  
  :deep(.el-input__prefix) {
    color: #00d4ff;
  }
}

.tech-select {
  width: 100%;
  
  :deep(.el-input__wrapper) {
    background: rgba(30, 39, 70, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.25);
    box-shadow: none;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(0, 212, 255, 0.5);
    }
    
    &.is-focus {
      border-color: #00d4ff;
      box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15), 0 0 12px rgba(0, 212, 255, 0.2);
    }
  }
  
  :deep(.el-input__inner) {
    color: #e2e8f0;
    font-weight: 500;
  }
}

.tech-date-picker {
  width: 100%;
  
  :deep(.el-input__wrapper) {
    background: rgba(30, 39, 70, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.25);
    box-shadow: none;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(0, 212, 255, 0.5);
    }
    
    &.is-focus {
      border-color: #00d4ff;
      box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15), 0 0 12px rgba(0, 212, 255, 0.2);
    }
  }
  
  :deep(.el-input__inner) {
    color: #e2e8f0;
    font-weight: 500;
  }
}

.tech-btn {
  background: rgba(30, 39, 70, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.4);
  color: #94a3b8;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00d4ff;
    color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.2);
  }
  
  &.tech-btn-primary {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    color: #fff;
    
    &:hover {
      background: linear-gradient(135deg, #00c4e8 0%, #6d34d1 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
    }
  }
  
  &.tech-btn-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    color: #fff;
    
    &:hover {
      background: linear-gradient(135deg, #0ea58e 0%, #047857 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
  }
  
  &.tech-btn-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: none;
    color: #fff;
    
    &:hover {
      background: linear-gradient(135deg, #e04444 0%, #c92626 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }
  }
  
  &.tech-btn-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border: none;
    color: #fff;
    
    &:hover {
      background: linear-gradient(135deg, #e0940b 0%, #c76d06 100%);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
    }
  }
}

.tech-table {
  :deep(.el-table__header-wrapper) {
    background: transparent;
    
    th {
      background: linear-gradient(180deg, #1e2746 0%, #1a2342 100%);
      color: #00d4ff;
      font-weight: 600;
      font-size: 13px;
      border-bottom: 1px solid rgba(0, 212, 255, 0.25);
      padding: 14px 0;
      text-shadow: 0 0 8px rgba(0, 212, 255, 0.2);
    }
  }
  
  :deep(.el-table__body-wrapper) {
    tr {
      background: transparent;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(0, 212, 255, 0.08) !important;
      }
      
      td {
        border-bottom: 1px solid rgba(0, 212, 255, 0.12);
        color: #cbd5e1;
        padding: 12px 0;
        font-size: 13px;
      }
    }
  }
  
  :deep(.el-checkbox__inner) {
    background: rgba(30, 39, 70, 0.8);
    border-color: rgba(0, 212, 255, 0.3);
    
    &:hover {
      border-color: #00d4ff;
    }
  }
}

.complaint-content {
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.6;
  max-height: 60px;
  overflow: hidden;
  
  :deep(p) {
    margin: 0;
  }
  
  :deep(*) {
    color: #94a3b8 !important;
  }
}

.time-text {
  color: #64748b;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.tech-dialog {
  :deep(.el-dialog) {
    background: linear-gradient(180deg, #111936 0%, #0f1629 100%);
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 12px;
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.2);
  }
  
  :deep(.el-dialog__header) {
    background: linear-gradient(90deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    padding: 16px 20px;
    margin-right: 0;
    
    .el-dialog__title {
      color: #00d4ff;
      font-weight: 600;
      font-size: 18px;
    }
  }
  
  :deep(.el-dialog__body) {
    background: transparent;
    padding: 20px;
  }
  
  :deep(.el-dialog__footer) {
    background: rgba(30, 39, 70, 0.5);
    border-top: 1px solid rgba(0, 212, 255, 0.15);
    padding: 16px 20px;
  }
}

.dialog-form {
  .el-form-item {
    margin-bottom: 18px;
    
    :deep(.el-form-item__label) {
      color: #94a3b8;
      font-weight: 500;
    }
  }
}

.tech-textarea {
  :deep(.el-textarea__inner) {
    background: rgba(30, 39, 70, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.25);
    color: #e2e8f0;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(0, 212, 255, 0.5);
    }
    
    &:focus {
      border-color: #00d4ff;
      box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15), 0 0 12px rgba(0, 212, 255, 0.2);
    }
    
    &::placeholder {
      color: #64748b;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  
  .cancel-btn {
    background: transparent;
    border: 1px solid rgba(0, 212, 255, 0.4);
    color: #94a3b8;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #00d4ff;
      color: #00d4ff;
      background: rgba(0, 212, 255, 0.1);
    }
  }
}

:deep(.el-form-item__label) {
  color: #94a3b8;
}

:deep(.el-select-dropdown) {
  background: rgba(17, 25, 54, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  
  .el-select-dropdown__item {
    color: #94a3b8;
    padding: 10px 16px;
    font-weight: 500;
    
    &:hover, &.selected {
      background: rgba(0, 212, 255, 0.15);
      color: #00d4ff;
    }
    
    &.selected {
      font-weight: 600;
    }
  }
}

:deep(.el-radio-group) {
  .el-radio {
    color: #94a3b8;
    
    .el-radio__input.is-checked .el-radio__inner {
      background-color: #00d4ff;
      border-color: #00d4ff;
      box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
    }
    
    .el-radio__label {
      color: #e2e8f0;
      font-weight: 500;
    }
  }
}
</style>
