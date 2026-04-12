<template>
  <div class="course-page tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">知识课堂管理</span>
      <span class="tech-subtitle">管理宠物知识课程、学习资料及发布内容</span>
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
            <el-form-item label="课程标题" prop="courseTitle">
              <el-input
                v-model="queryParams.courseTitle"
                placeholder="请输入课程标题"
                clearable
                @keyup.enter="handleQuery"
                class="tech-input"
              >
                <template #prefix><el-icon><Reading /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="课程类型" prop="courseType">
              <el-select v-model="queryParams.courseType" placeholder="请选择课程类型" clearable class="tech-select">
                <el-option
                  v-for="dict in courese"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="难度等级" prop="difficultyLevel">
              <el-select v-model="queryParams.difficultyLevel" placeholder="请选择难度等级" clearable class="tech-select">
                <el-option
                  v-for="dict in tyepse"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="讲师名称" prop="teacherName">
              <el-input
                v-model="queryParams.teacherName"
                placeholder="请输入讲师名称"
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
            <el-icon class="title-icon"><Collection /></el-icon>
            课程列表
          </span>
          <div class="header-actions">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['course:course:add']"
              class="tech-btn tech-btn-primary"
            >新增课程</el-button>
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['course:course:edit']"
              class="tech-btn tech-btn-success"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['course:course:remove']"
              class="tech-btn tech-btn-danger"
            >删除</el-button>
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['course:course:export']"
              class="tech-btn tech-btn-warning"
            >导出</el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange" class="tech-table" stripe>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="课程ID" align="center" prop="courseId" width="80" />
        <el-table-column label="封面" align="center" width="100">
          <template #default="scope">
            <el-image
              v-if="scope.row.courseCover"
              :src="scope.row.courseCover"
              :preview-src-list="[scope.row.courseCover]"
              fit="cover"
              class="course-cover"
            >
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div v-else class="image-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程标题" align="center" prop="courseTitle" min-width="150" show-overflow-tooltip />
        <el-table-column label="课程类型" align="center" prop="courseType" width="100">
          <template #default="scope">
            <dict-tag :options="courese" :value="scope.row.courseType"/>
          </template>
        </el-table-column>
        <el-table-column label="难度等级" align="center" prop="difficultyLevel" width="100">
          <template #default="scope">
            <el-tag :type="getDifficultyType(scope.row.difficultyLevel)" effect="dark" size="small">
              <dict-tag :options="tyepse" :value="scope.row.difficultyLevel"/>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="讲师名称" align="center" prop="teacherName" width="120" />
        <el-table-column label="查看次数" align="center" prop="viewCount" width="100">
          <template #default="scope">
            <span class="stat-number">
              <el-icon><View /></el-icon>
              {{ scope.row.viewCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="收藏次数" align="center" prop="collectCount" width="100">
          <template #default="scope">
            <span class="stat-number collect">
              <el-icon><Star /></el-icon>
              {{ scope.row.collectCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" prop="publishTime" width="160">
          <template #default="scope">
            <span class="time-text">{{ parseTime(scope.row.publishTime, '{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['course:course:edit']">修改</el-button>
            <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['course:course:remove']">删除</el-button>
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
      <el-form ref="courseRef" :model="form" :rules="rules" label-width="100px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="课程标题" prop="courseTitle">
              <el-input v-model="form.courseTitle" placeholder="请输入课程标题" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="courseType">
              <el-select v-model="form.courseType" placeholder="请选择课程类型" class="tech-select">
                <el-option
                  v-for="dict in courese"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度等级" prop="difficultyLevel">
              <el-select v-model="form.difficultyLevel" placeholder="请选择难度等级" class="tech-select">
                <el-option
                  v-for="dict in tyepse"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="封面图片URL" prop="courseCover">
              <el-input v-model="form.courseCover" placeholder="请输入封面图片URL" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程内容" prop="courseContent">
              <editor v-model="form.courseContent" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="讲师名称" prop="teacherName">
              <el-input v-model="form.teacherName" placeholder="请输入讲师名称" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="查看次数" prop="viewCount">
              <el-input v-model="form.viewCount" placeholder="请输入查看次数" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收藏次数" prop="collectCount">
              <el-input v-model="form.collectCount" placeholder="请输入收藏次数" class="tech-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布人" prop="publishUserId">
              <el-input v-model="form.publishUserId" placeholder="请输入发布人" class="tech-input" />
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
          <el-col :span="24">
            <el-form-item label="讲师简介" prop="teacherDesc">
              <el-input v-model="form.teacherDesc" type="textarea" placeholder="请输入内容" class="tech-textarea" />
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

<script setup name="Course">
import { listCourse, getCourse, delCourse, addCourse, updateCourse } from "@/api/course/course"

const { proxy } = getCurrentInstance()
const { tyepse, courese, ljsc } = proxy.useDict('tyepse', 'courese', 'ljsc')

const courseList = ref([])
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
    courseTitle: null,
    courseType: null,
    difficultyLevel: null,
    courseCover: null,
    courseContent: null,
    teacherName: null,
    teacherDesc: null,
    viewCount: null,
    collectCount: null,
    publishStatus: null,
    publishUserId: null,
    publishTime: null,
    isDeleted: null
  },
  rules: {
    courseTitle: [
      { required: true, message: "课程标题不能为空", trigger: "blur" }
    ],
    courseType: [
      { required: true, message: "课程类型不能为空", trigger: "change" }
    ],
    courseContent: [
      { required: true, message: "课程内容不能为空", trigger: "blur" }
    ],
    publishUserId: [
      { required: true, message: "发布人不能为空", trigger: "blur" }
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
  listCourse(queryParams.value).then(response => {
    courseList.value = response.rows
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
    courseId: null,
    courseTitle: null,
    courseType: null,
    difficultyLevel: null,
    courseCover: null,
    courseContent: null,
    teacherName: null,
    teacherDesc: null,
    viewCount: null,
    collectCount: null,
    publishStatus: null,
    publishUserId: null,
    publishTime: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  }
  proxy.resetForm("courseRef")
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
  ids.value = selection.map(item => item.courseId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = "添加知识课堂"
}

function handleUpdate(row) {
  reset()
  const _courseId = row.courseId || ids.value
  getCourse(_courseId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改知识课堂"
  })
}

function submitForm() {
  proxy.$refs["courseRef"].validate(valid => {
    if (valid) {
      if (form.value.courseId != null) {
        updateCourse(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addCourse(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

function handleDelete(row) {
  const _courseIds = row.courseId || ids.value
  proxy.$modal.confirm('是否确认删除知识课堂编号为"' + _courseIds + '"的数据项？').then(function() {
    return delCourse(_courseIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

function handleExport() {
  proxy.download('course/course/export', {
    ...queryParams.value
  }, `course_${new Date().getTime()}.xlsx`)
}

function getDifficultyType(level) {
  const typeMap = {
    '0': 'success',
    '1': 'warning',
    '2': 'danger'
  }
  return typeMap[level] || 'info'
}

getList()
</script>

<style scoped lang="scss">
.course-page {
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

.course-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid rgba(0, 212, 255, 0.4);
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.25);
  }
}

.image-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px dashed rgba(0, 212, 255, 0.4);
  background: rgba(30, 39, 70, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  margin: 0 auto;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #00d4ff;
    color: #00d4ff;
  }
}

.stat-number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #94a3b8;
  font-weight: 500;
  
  .el-icon {
    font-size: 14px;
  }
  
  &.collect {
    color: #fbbf24;
    
    .el-icon {
      color: #fbbf24;
      filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.4));
    }
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
    transition: all 0.3s ease;
    
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  
  .el-select-dropdown__item {
    color: #94a3b8;
    
    &:hover, &.selected {
      background: rgba(0, 212, 255, 0.15);
      color: #00d4ff;
    }
  }
}

:deep(.el-picker-panel) {
  background: rgba(17, 25, 54, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.3);
  
  .el-date-picker__header-label,
  .el-date-table th,
  .el-date-table td span {
    color: #94a3b8;
  }
  
  .el-date-table td.current:not(.disabled) span {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    color: #fff;
  }
  
  .el-date-table td.today span {
    color: #00d4ff;
  }
  
  .el-picker-panel__icon-btn {
    color: #64748b;
    
    &:hover {
      color: #00d4ff;
    }
  }
}
</style>
