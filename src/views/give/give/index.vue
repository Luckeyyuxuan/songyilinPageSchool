<template>
  <div class="give-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">救助信息管理</span>
      <span class="tech-subtitle">管理宠物救助信息、资金筹集及审核流程</span>
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
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="80px" class="search-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="宠物编码" prop="petId">
              <el-input v-model="queryParams.petId" placeholder="请输入宠物编码" clearable @keyup.enter="handleQuery" class="tech-input">
                <template #prefix><el-icon><Key /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="救助状态" prop="rescueStatus">
              <el-select v-model="queryParams.rescueStatus" placeholder="请选择救助状态" clearable class="tech-select">
                <el-option v-for="dict in jzxq" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="紧急程度" prop="urgentLevel">
              <el-select v-model="queryParams.urgentLevel" placeholder="请选择紧急程度" clearable class="tech-select">
                <el-option v-for="dict in jjcd" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="需求类型" prop="needType">
              <el-select v-model="queryParams.needType" placeholder="请选择需求类型" clearable class="tech-select">
                <el-option v-for="dict in xuqiuteurs" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="目标资金" prop="targetAmount">
              <el-input v-model="queryParams.targetAmount" placeholder="请输入目标资金" clearable @keyup.enter="handleQuery" class="tech-input">
                <template #prefix><el-icon><Coin /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择开始时间" class="tech-date-picker" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择结束时间" class="tech-date-picker" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="发现地点" prop="foundPlace">
              <el-input v-model="queryParams.foundPlace" placeholder="请输入发现地点" clearable @keyup.enter="handleQuery" class="tech-input">
                <template #prefix><el-icon><Location /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="审核状态" prop="verifyStatus">
              <el-select v-model="queryParams.verifyStatus" placeholder="请选择审核状态" clearable class="tech-select">
                <el-option v-for="dict in sh" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="审核人" prop="verifyUserId">
              <el-input v-model="queryParams.verifyUserId" placeholder="请输入审核管理员" clearable @keyup.enter="handleQuery" class="tech-input">
                <template #prefix><el-icon><User /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item>
              <el-button type="primary" class="tech-btn search-btn" @click="handleQuery">
                <el-icon><Search /></el-icon>搜索
              </el-button>
              <el-button class="reset-btn" @click="resetQuery">
                <el-icon><RefreshRight /></el-icon>重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="tech-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon"><List /></el-icon>救助列表
          </span>
          <div class="header-actions">
            <el-button type="primary" class="tech-btn" @click="handleAdd" v-hasPermi="['give:give:add']">
              <el-icon><Plus /></el-icon>新增
            </el-button>
            <el-button type="success" class="tech-btn" :disabled="single" @click="handleUpdate" v-hasPermi="['give:give:edit']">
              <el-icon><Edit /></el-icon>修改
            </el-button>
            <el-button type="danger" class="tech-btn" :disabled="multiple" @click="handleDelete" v-hasPermi="['give:give:remove']">
              <el-icon><Delete /></el-icon>删除
            </el-button>
            <el-button type="warning" class="tech-btn" @click="handleExport" v-hasPermi="['give:give:export']">
              <el-icon><Download /></el-icon>导出
            </el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="giveList" @selection-change="handleSelectionChange" class="tech-table">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="救助ID" align="center" prop="rescueId" width="100">
          <template #default="scope">
            <span class="id-badge">{{ scope.row.rescueId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="宠物编码" align="center" prop="petId" width="120">
          <template #default="scope">
            <span class="pet-code">{{ scope.row.petId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="救助状态" align="center" prop="rescueStatus" width="100">
          <template #default="scope">
            <dict-tag :options="jzxq" :value="scope.row.rescueStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="紧急程度" align="center" prop="urgentLevel" width="100">
          <template #default="scope">
            <dict-tag :options="jjcd" :value="scope.row.urgentLevel"/>
          </template>
        </el-table-column>
        <el-table-column label="需求类型" align="center" prop="needType" width="100">
          <template #default="scope">
            <dict-tag :options="xuqiuteurs" :value="scope.row.needType"/>
          </template>
        </el-table-column>
        <el-table-column label="需求描述" align="center" prop="needDesc" show-overflow-tooltip min-width="150" />
        <el-table-column label="目标资金" align="center" prop="targetAmount" width="100">
          <template #default="scope">
            <span class="amount-text">{{ scope.row.targetAmount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已筹资金" align="center" prop="raisedAmount" width="100">
          <template #default="scope">
            <span class="amount-raised">{{ scope.row.raisedAmount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="媒体文件" align="center" prop="mediaUrl" width="100">
          <template #default="scope">
            <div v-if="scope.row.mediaUrl" class="media-preview-cell">
              <el-image v-if="isImage(scope.row.mediaUrl)" :src="scope.row.mediaUrl" fit="cover" class="media-thumb" :preview-src-list="[scope.row.mediaUrl]" />
              <el-icon v-else class="media-icon"><VideoCamera /></el-icon>
            </div>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="verifyStatus" width="100">
          <template #default="scope">
            <dict-tag :options="sh" :value="scope.row.verifyStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center" prop="verifyUserId" width="100" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
          <template #default="scope">
            <div class="action-btns">
              <el-button link type="primary" class="action-btn" @click="handleUpdate(scope.row)" v-hasPermi="['give:give:edit']">
                <el-icon><Edit /></el-icon>修改
              </el-button>
              <el-button link type="danger" class="action-btn" @click="handleDelete(scope.row)" v-hasPermi="['give:give:remove']">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" class="tech-pagination" />
    </el-card>

    <!-- 添加或修改救助信息对话框 -->
    <el-dialog :title="title" v-model="open" width="750px" append-to-body class="tech-dialog">
      <el-form ref="giveRef" :model="form" :rules="rules" label-width="100px" class="give-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="宠物编码" prop="petId">
              <el-input v-model="form.petId" readonly placeholder="系统自动生成" class="tech-input">
                <template #prefix><el-icon><Key /></el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item label="救助状态" prop="rescueStatus">
              <el-select v-model="form.rescueStatus" placeholder="请选择救助状态" class="tech-select">
                <el-option v-for="dict in jzxq" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="紧急程度" prop="urgentLevel">
              <el-select v-model="form.urgentLevel" placeholder="请选择紧急程度" class="tech-select">
                <el-option v-for="dict in jjcd" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
            <el-form-item label="需求类型" prop="needType">
              <el-select v-model="form.needType" placeholder="请选择需求类型" class="tech-select">
                <el-option v-for="dict in xuqiuteurs" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="目标资金" prop="targetAmount">
              <el-input v-model="form.targetAmount" placeholder="请输入目标资金" class="tech-input">
                <template #prefix><el-icon><Coin /></el-icon></template>
                <template #suffix><span class="input-suffix">元</span></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已筹资金" prop="raisedAmount">
              <el-input v-model="form.raisedAmount" placeholder="请输入已筹资金" class="tech-input">
                <template #prefix><el-icon><Coin /></el-icon></template>
                <template #suffix><span class="input-suffix">元</span></template>
              </el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="form.startTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择开始时间" class="tech-date-picker" />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="form.endTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择结束时间" class="tech-date-picker" />
            </el-form-item>
            <el-form-item label="发现地点" prop="foundPlace">
              <el-input v-model="form.foundPlace" placeholder="请输入发现地点" class="tech-input">
                <template #prefix><el-icon><Location /></el-icon></template>
              </el-input>
            </el-form-item>
            <el-form-item label="审核状态" prop="verifyStatus">
              <el-select v-model="form.verifyStatus" placeholder="请选择审核状态" @change="handleVerifyStatusChange" class="tech-select">
                <el-option v-for="dict in sh" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="需求描述" prop="needDesc">
              <el-input v-model="form.needDesc" type="textarea" placeholder="请输入需求描述" :rows="3" class="tech-textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="媒体文件" prop="mediaUrl">
              <el-upload class="avatar-uploader" :action="'/common/upload'" :show-file-list="false" :on-success="handleMediaUploadSuccess" :before-upload="beforeMediaUpload">
                <div v-if="form.mediaUrl" class="media-preview">
                  <el-image v-if="isImage(form.mediaUrl)" :src="form.mediaUrl" fit="cover" class="uploaded-image" />
                  <el-icon v-else class="uploaded-video-icon"><VideoCamera /></el-icon>
                  <div class="media-overlay">
                    <el-icon><Refresh /></el-icon>
                    <span>更换</span>
                  </div>
                </div>
                <div v-else class="upload-placeholder">
                  <el-icon class="upload-icon"><Plus /></el-icon>
                  <span>上传媒体</span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核管理员" prop="verifyUserId">
              <el-input v-model="form.verifyUserId" readonly placeholder="系统自动填充" class="tech-input">
                <template #prefix><el-icon><User /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel" class="cancel-btn">取 消</el-button>
          <el-button type="primary" @click="submitForm" class="tech-btn">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Give">
import { listGive, getGive, delGive, addGive, updateGive } from "@/api/give/give"
import useUserStore from "@/store/modules/user"
import { Search, RefreshRight, Plus, Edit, Delete, Download, Key, User, List, VideoCamera, Refresh, Coin, Location } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()
const { ljsc, xuqiuteurs, sh, jzxq, jjcd } = proxy.useDict('ljsc', 'xuqiuteurs', 'sh', 'jzxq', 'jjcd')
const userStore = useUserStore()

const giveList = ref([])
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
    petId: null,
    rescueTitle: null,
    rescueStatus: null,
    urgentLevel: null,
    needType: null,
    needDesc: null,
    targetAmount: null,
    raisedAmount: null,
    startTime: null,
    endTime: null,
    foundPlace: null,
    mediaUrl: null,
    verifyStatus: null,
    verifyUserId: null,
    verifyRemark: null,
    isDeleted: null
  },
  rules: {
    petId: [{ required: true, message: "宠物ID不能为空", trigger: "blur" }],
    rescueStatus: [{ required: true, message: "救助状态不能为空", trigger: "change" }],
    urgentLevel: [{ required: true, message: "紧急程度不能为空", trigger: "change" }],
    needType: [{ required: true, message: "需求类型不能为空", trigger: "change" }],
    needDesc: [{ required: true, message: "需求描述不能为空", trigger: "blur" }],
    startTime: [{ required: true, message: "开始时间不能为空", trigger: "blur" }],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询救助信息列表 */
function getList() {
  loading.value = true
  listGive(queryParams.value).then(response => {
    giveList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    rescueId: null,
    petId: null,
    rescueTitle: '',
    rescueStatus: null,
    urgentLevel: null,
    needType: null,
    needDesc: null,
    targetAmount: null,
    raisedAmount: null,
    startTime: null,
    endTime: null,
    foundPlace: null,
    mediaUrl: null,
    verifyStatus: null,
    verifyUserId: null,
    verifyRemark: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  }
  proxy.resetForm("giveRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.rescueId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  form.value.petId = generateUUID()
  open.value = true
  title.value = "添加救助信息"
}

// 生成唯一编码的函数
function generateUUID() {
  const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return parseInt(timestamp + random)
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _rescueId = row.rescueId || ids.value
  getGive(_rescueId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改救助信息"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["giveRef"].validate(valid => {
    if (valid) {
      if (!form.value.rescueTitle) {
        form.value.rescueTitle = ''
      }
      if (form.value.rescueId != null) {
        updateGive(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addGive(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _rescueIds = row.rescueId || ids.value
  proxy.$modal.confirm('是否确认删除救助信息编号为"' + _rescueIds + '"的数据项？').then(function() {
    return delGive(_rescueIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 审核状态变更处理 */
function handleVerifyStatusChange() {
  if (form.value.verifyStatus === 1 || form.value.verifyStatus === 2) {
    form.value.verifyUserId = userStore.name
  }
}

// 判断是否为图片
function isImage(url) {
  if (!url) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  const ext = url.toLowerCase().substring(url.lastIndexOf('.'))
  return imageExtensions.includes(ext)
}

// 媒体文件上传成功回调
function handleMediaUploadSuccess(response) {
  if (response.code === 200) {
    form.value.mediaUrl = response.url
    proxy.$modal.msgSuccess("上传成功")
  } else {
    proxy.$modal.msgError("上传失败")
  }
}

// 上传前验证
function beforeMediaUpload(file) {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  const isLt20M = file.size / 1024 / 1024 < 20

  if (!isImage && !isVideo) {
    proxy.$modal.msgError('只能上传图片或视频文件！')
    return false
  }
  if (!isLt20M) {
    proxy.$modal.msgError('文件大小不能超过 20MB！')
    return false
  }
  return true
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('give/give/export', {
    ...queryParams.value
  }, `give_${new Date().getTime()}.xlsx`)
}

getList()
</script>

<style scoped lang="scss">
.give-page {
  padding: 20px;
  min-height: calc(100vh - 84px);
}

.tech-title {
  margin-bottom: 24px;
  
  .tech-gradient-text {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .tech-subtitle {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    color: #94a3b8;
  }
}

.tech-card {
  background: #111936;
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00d4ff, #7c3aed);
  }
  
  :deep(.el-card__header) {
    background: rgba(0, 212, 255, 0.05);
    border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    padding: 16px 20px;
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #00d4ff;
    
    .title-icon {
      font-size: 18px;
    }
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.search-form {
  .el-form-item {
    margin-bottom: 16px;
  }
}

.tech-input, .tech-select, .tech-date-picker {
  width: 100%;
  
  :deep(.el-input__wrapper) {
    background: #1e2746;
    border: 1px solid rgba(0, 212, 255, 0.2);
    box-shadow: none;
    
    &:hover, &:focus {
      border-color: #00d4ff;
    }
  }
  
  :deep(.el-input__inner) {
    color: #fff;
    background: transparent;
    
    &::placeholder {
      color: #64748b;
    }
  }
  
  :deep(.el-input__prefix) {
    color: #00d4ff;
  }
}

.tech-date-picker {
  :deep(.el-input__wrapper) {
    padding-left: 11px;
  }
}

.tech-btn {
  background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
  border: none;
  color: #fff;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.is-disabled {
    background: #1e2746;
    color: #64748b;
  }
}

.reset-btn {
  background: transparent;
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #94a3b8;
  
  &:hover {
    border-color: #00d4ff;
    color: #00d4ff;
  }
}

.tech-table {
  background: transparent;
  
  :deep(.el-table__header) {
    th {
      background: #1e2746;
      color: #00d4ff;
      font-weight: 600;
      border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    }
  }
  
  :deep(.el-table__body) {
    tr {
      background: transparent;
      
      &:hover {
        background: rgba(0, 212, 255, 0.05);
      }
      
      td {
        color: #94a3b8;
        border-bottom: 1px solid rgba(0, 212, 255, 0.1);
      }
    }
  }
}

.id-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  color: #00d4ff;
  font-family: monospace;
  font-size: 12px;
}

.pet-code {
  color: #fff;
  font-weight: 500;
}

.amount-text, .amount-raised {
  color: #f59e0b;
  font-weight: 600;
  font-size: 14px;
}

.amount-raised {
  color: #10b981;
}

.media-preview-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  
  .media-thumb {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    border: 1px solid rgba(0, 212, 255, 0.3);
  }
  
  .media-icon {
    font-size: 24px;
    color: #00d4ff;
  }
}

.empty-text {
  color: #64748b;
}

.action-btns {
  display: flex;
  justify-content: center;
  gap: 8px;
  
  .action-btn {
    padding: 4px 8px;
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

.tech-pagination {
  margin-top: 20px;
  
  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    color: #94a3b8;
  }
  
  :deep(.el-pager li) {
    background: #1e2746;
    border: 1px solid rgba(0, 212, 255, 0.2);
    color: #94a3b8;
    
    &:hover {
      color: #00d4ff;
      border-color: #00d4ff;
    }
    
    &.is-active {
      background: #00d4ff;
      border-color: #00d4ff;
      color: #fff;
    }
  }
  
  :deep(.btn-prev),
  :deep(.btn-next) {
    background: #1e2746;
    border: 1px solid rgba(0, 212, 255, 0.2);
    color: #94a3b8;
    
    &:hover {
      color: #00d4ff;
    }
  }
}

.tech-dialog {
  :deep(.el-dialog) {
    background: #111936;
    border: 1px solid rgba(0, 212, 255, 0.3);
    border-radius: 12px;
  }
  
  :deep(.el-dialog__header) {
    background: rgba(0, 212, 255, 0.05);
    border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    margin-right: 0;
    padding: 16px 20px;
  }
  
  :deep(.el-dialog__title) {
    color: #00d4ff;
    font-weight: 600;
  }
  
  :deep(.el-dialog__body) {
    padding: 20px;
  }
  
  :deep(.el-dialog__footer) {
    border-top: 1px solid rgba(0, 212, 255, 0.1);
    padding: 16px 20px;
  }
}

.give-form {
  .el-form-item__label {
    color: #94a3b8;
  }
  
  .input-suffix {
    color: #64748b;
    font-size: 12px;
  }
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed rgba(0, 212, 255, 0.3);
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    
    &:hover {
      border-color: #00d4ff;
      background: rgba(0, 212, 255, 0.05);
    }
  }
}

.media-preview {
  width: 120px;
  height: 120px;
  position: relative;
  
  .uploaded-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .uploaded-video-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 8px;
  }
  
  .media-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 8px;
    
    &:hover {
      opacity: 1;
    }
    
    .el-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }
  }
}

.upload-placeholder {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  
  .upload-icon {
    font-size: 28px;
    margin-bottom: 8px;
    color: #00d4ff;
  }
  
  span {
    font-size: 12px;
  }
}

.tech-textarea {
  :deep(.el-textarea__inner) {
    background: #1e2746;
    border: 1px solid rgba(0, 212, 255, 0.2);
    color: #fff;
    
    &:focus {
      border-color: #00d4ff;
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
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: #94a3b8;
    
    &:hover {
      border-color: #00d4ff;
      color: #00d4ff;
    }
  }
}

:deep(.el-form-item__label) {
  color: #94a3b8;
}

:deep(.el-select-dropdown) {
  background: #1e2746;
  border: 1px solid rgba(0, 212, 255, 0.2);
  
  .el-select-dropdown__item {
    color: #94a3b8;
    
    &:hover, &.selected {
      background: rgba(0, 212, 255, 0.1);
      color: #00d4ff;
    }
  }
}
</style>
