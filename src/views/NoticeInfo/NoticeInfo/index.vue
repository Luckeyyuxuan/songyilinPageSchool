<template>
  <div class="notice-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">公告信息管理</span>
      <span class="tech-subtitle">管理系统公告、通知信息及发布状态</span>
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
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="90px" class="search-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input
                v-model="queryParams.noticeTitle"
                placeholder="请输入公告标题"
                clearable
                @keyup.enter="handleQuery"
                class="tech-input"
              >
                <template #prefix><el-icon><Document /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="queryParams.noticeType" placeholder="请选择公告类型" clearable class="tech-select">
                <el-option
                  v-for="dict in gglx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="是否弹窗" prop="isPopup">
              <el-select v-model="queryParams.isPopup" placeholder="请选择是否弹窗" clearable class="tech-select">
                <el-option
                  v-for="dict in sftc"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发布人ID" prop="publishUserId">
              <el-input
                v-model="queryParams.publishUserId"
                placeholder="请输入发布人ID"
                clearable
                @keyup.enter="handleQuery"
                class="tech-input"
              >
                <template #prefix><el-icon><User /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发布时间" prop="publishTime">
              <el-date-picker clearable
                v-model="queryParams.publishTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择发布时间"
                class="tech-date-picker">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="下架时间" prop="offlineTime">
              <el-date-picker clearable
                v-model="queryParams.offlineTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择下架时间"
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
            <el-icon class="title-icon"><Bell /></el-icon>
            公告列表
          </span>
          <div class="header-actions">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['NoticeInfo:NoticeInfo:add']"
              class="tech-btn tech-btn-primary"
            >新增公告</el-button>
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['NoticeInfo:NoticeInfo:edit']"
              class="tech-btn tech-btn-success"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['NoticeInfo:NoticeInfo:remove']"
              class="tech-btn tech-btn-danger"
            >删除</el-button>
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['NoticeInfo:NoticeInfo:export']"
              class="tech-btn tech-btn-warning"
            >导出</el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="NoticeInfoList" @selection-change="handleSelectionChange" class="tech-table" stripe>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="noticeId" width="80" />
        <el-table-column label="公告标题" align="center" prop="noticeTitle" min-width="150" show-overflow-tooltip />
        <el-table-column label="公告类型" align="center" prop="noticeType" width="100">
          <template #default="scope">
            <el-tag :type="getNoticeTypeColor(scope.row.noticeType)" effect="dark" size="small">
              <dict-tag :options="gglx" :value="scope.row.noticeType"/>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="公告内容" align="center" prop="noticeContent" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <div class="notice-content" v-html="scope.row.noticeContent"></div>
          </template>
        </el-table-column>
        <el-table-column label="是否弹窗" align="center" prop="isPopup" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.isPopup === '1' ? 'warning' : 'info'" effect="dark" size="small">
              <dict-tag :options="sftc" :value="scope.row.isPopup"/>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布人ID" align="center" prop="publishUserId" width="100" />
        <el-table-column label="发布时间" align="center" prop="publishTime" width="160">
          <template #default="scope">
            <span class="time-text">{{ parseTime(scope.row.publishTime, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下架时间" align="center" prop="offlineTime" width="160">
          <template #default="scope">
            <span class="time-text">{{ parseTime(scope.row.offlineTime, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查看次数" align="center" prop="viewCount" width="100">
          <template #default="scope">
            <span class="stat-number">
              <el-icon><View /></el-icon>
              {{ scope.row.viewCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['NoticeInfo:NoticeInfo:edit']">修改</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['NoticeInfo:NoticeInfo:remove']">删除</el-button>
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
      <el-form ref="NoticeInfoRef" :model="form" :rules="rules" label-width="100px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择公告类型" class="tech-select">
                <el-option
                  v-for="dict in gglx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否弹窗" prop="isPopup">
              <el-select v-model="form.isPopup" placeholder="请选择是否弹窗" class="tech-select">
                <el-option
                  v-for="dict in sftc"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公告内容" prop="noticeContent">
              <editor v-model="form.noticeContent" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布人ID" prop="publishUserId">
              <el-input v-model="form.publishUserId" placeholder="请输入发布人ID" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="查看次数" prop="viewCount">
              <el-input v-model="form.viewCount" placeholder="请输入查看次数" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布时间" prop="publishTime">
              <el-date-picker clearable
                v-model="form.publishTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择发布时间"
                class="tech-date-picker">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下架时间" prop="offlineTime">
              <el-date-picker clearable
                v-model="form.offlineTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择下架时间"
                class="tech-date-picker">
              </el-date-picker>
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

<script setup name="NoticeInfo">
import { listNoticeInfo, getNoticeInfo, delNoticeInfo, addNoticeInfo, updateNoticeInfo } from "@/api/NoticeInfo/NoticeInfo"

const { proxy } = getCurrentInstance()
const { ljsc, mbyhlx, gglx, sftc } = proxy.useDict('ljsc', 'mbyhlx', 'gglx', 'sftc')

const NoticeInfoList = ref([])
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
    noticeTitle: null,
    noticeType: null,
    noticeContent: null,
    targetUserType: null,
    isPopup: null,
    publishUserId: null,
    publishTime: null,
    offlineTime: null,
    viewCount: null,
    isDeleted: null
  },
  rules: {
    noticeTitle: [
      { required: true, message: "公告标题不能为空", trigger: "blur" }
    ],
    noticeType: [
      { required: true, message: "公告类型不能为空", trigger: "change" }
    ],
    noticeContent: [
      { required: true, message: "公告内容不能为空", trigger: "blur" }
    ],
    publishUserId: [
      { required: true, message: "发布人ID不能为空", trigger: "blur" }
    ],
    publishTime: [
      { required: true, message: "发布时间不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "更新时间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listNoticeInfo(queryParams.value).then(response => {
    NoticeInfoList.value = response.rows
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
    noticeId: null,
    noticeTitle: null,
    noticeType: null,
    noticeContent: null,
    targetUserType: null,
    isPopup: null,
    publishUserId: null,
    publishTime: null,
    offlineTime: null,
    viewCount: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  }
  proxy.resetForm("NoticeInfoRef")
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
  ids.value = selection.map(item => item.noticeId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = "添加公告信息"
}

function handleUpdate(row) {
  reset()
  const _noticeId = row.noticeId || ids.value
  getNoticeInfo(_noticeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改公告信息"
  })
}

function submitForm() {
  proxy.$refs["NoticeInfoRef"].validate(valid => {
    if (valid) {
      if (form.value.noticeId != null) {
        updateNoticeInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addNoticeInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

function handleDelete(row) {
  const _noticeIds = row.noticeId || ids.value
  proxy.$modal.confirm('是否确认删除公告信息编号为"' + _noticeIds + '"的数据项？').then(function() {
    return delNoticeInfo(_noticeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

function handleExport() {
  proxy.download('NoticeInfo/NoticeInfo/export', {
    ...queryParams.value
  }, `NoticeInfo_${new Date().getTime()}.xlsx`)
}

function getNoticeTypeColor(type) {
  const colorMap = {
    '0': 'primary',
    '1': 'success',
    '2': 'warning',
    '3': 'danger'
  }
  return colorMap[type] || 'info'
}

getList()
</script>

<style scoped lang="scss">
.notice-page {
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

.notice-content {
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

.stat-number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #00d4ff;
  font-weight: 600;
  
  .el-icon {
    font-size: 14px;
    color: #00d4ff;
    filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.4));
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
  border: 1px solid rgba
