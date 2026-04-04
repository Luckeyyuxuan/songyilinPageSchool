<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="举报人ID" prop="reportUserId">
        <el-input
          v-model="queryParams.reportUserId"
          placeholder="请输入举报人ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="举报对象类型" prop="targetType">
        <el-select v-model="queryParams.targetType" placeholder="请选择举报对象类型" clearable>
          <el-option
            v-for="dict in tsjb"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="举报对象ID" prop="targetId">
        <el-input
          v-model="queryParams.targetId"
          placeholder="请输入举报对象ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="投诉类型" prop="complaintType">
        <el-select v-model="queryParams.complaintType" placeholder="请选择投诉类型" clearable>
          <el-option
            v-for="dict in afds"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否匿名" prop="isAnonymous">
        <el-select v-model="queryParams.isAnonymous" placeholder="请选择是否匿名" clearable>
          <el-option
            v-for="dict in sfnm"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="handleStatus">
        <el-select v-model="queryParams.handleStatus" placeholder="请选择处理状态" clearable>
          <el-option
            v-for="dict in dansjd"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理人ID" prop="handleUserId">
        <el-input
          v-model="queryParams.handleUserId"
          placeholder="请输入处理人ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处理时间" prop="handleTime">
        <el-date-picker clearable
          v-model="queryParams.handleTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择处理时间">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="逻辑删除" prop="isDeleted">
        <el-select v-model="queryParams.isDeleted" placeholder="请选择逻辑删除" clearable>
          <el-option
            v-for="dict in ljsc"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['ComplaintReport:ComplaintReport:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['ComplaintReport:ComplaintReport:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['ComplaintReport:ComplaintReport:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['ComplaintReport:ComplaintReport:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ComplaintReportList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="complaintId" />
      <el-table-column label="举报人ID" align="center" prop="reportUserId" />
      <el-table-column label="举报对象类型" align="center" prop="targetType">
        <template #default="scope">
          <dict-tag :options="tsjb" :value="scope.row.targetType"/>
        </template>
      </el-table-column>
      <el-table-column label="举报对象ID" align="center" prop="targetId" />
      <el-table-column label="投诉类型" align="center" prop="complaintType">
        <template #default="scope">
          <dict-tag :options="afds" :value="scope.row.complaintType"/>
        </template>
      </el-table-column>
      <el-table-column label="投诉内容" align="center" prop="complaintContent">
        <template #default="scope">
          <div v-html="scope.row.complaintContent"></div>
        </template>
      </el-table-column>
      <el-table-column label="证据图片/文件URL" align="center" prop="evidenceUrl" />
      <el-table-column label="是否匿名" align="center" prop="isAnonymous">
        <template #default="scope">
          <dict-tag :options="sfnm" :value="scope.row.isAnonymous"/>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center" prop="handleStatus">
        <template #default="scope">
          <dict-tag :options="dansjd" :value="scope.row.handleStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="处理人ID" align="center" prop="handleUserId" />
      <el-table-column label="处理结果" align="center" prop="handleRemark" />
      <el-table-column label="处理时间" align="center" prop="handleTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.handleTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="逻辑删除" align="center" prop="isDeleted">
        <template #default="scope">
          <dict-tag :options="ljsc" :value="scope.row.isDeleted"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ComplaintReport:ComplaintReport:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ComplaintReport:ComplaintReport:remove']">删除</el-button>
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

    <!-- 添加或修改投诉举报（用户投诉举报记录）对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="ComplaintReportRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="举报人ID" prop="reportUserId">
          <el-input v-model="form.reportUserId" placeholder="请输入举报人ID" />
        </el-form-item>
        <el-form-item label="举报对象类型" prop="targetType">
          <el-select v-model="form.targetType" placeholder="请选择举报对象类型">
            <el-option
              v-for="dict in tsjb"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="举报对象ID" prop="targetId">
          <el-input v-model="form.targetId" placeholder="请输入举报对象ID" />
        </el-form-item>
        <el-form-item label="投诉类型" prop="complaintType">
          <el-select v-model="form.complaintType" placeholder="请选择投诉类型">
            <el-option
              v-for="dict in afds"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉内容" prop="complaintContent">
          <editor v-model="form.complaintContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="证据图片/文件URL" prop="evidenceUrl">
          <el-input v-model="form.evidenceUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否匿名" prop="isAnonymous">
          <el-radio-group v-model="form.isAnonymous">
            <el-radio
              v-for="dict in sfnm"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理状态" prop="handleStatus">
          <el-select v-model="form.handleStatus" placeholder="请选择处理状态">
            <el-option
              v-for="dict in dansjd"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理人ID" prop="handleUserId">
          <el-input v-model="form.handleUserId" placeholder="请输入处理人ID" />
        </el-form-item>
        <el-form-item label="处理结果" prop="handleRemark">
          <el-input v-model="form.handleRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="处理时间" prop="handleTime">
          <el-date-picker clearable
            v-model="form.handleTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择处理时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="逻辑删除" prop="isDeleted">
          <el-select v-model="form.isDeleted" placeholder="请选择逻辑删除">
            <el-option
              v-for="dict in ljsc"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="ComplaintReport">
import { listComplaintReport, getComplaintReport, delComplaintReport, addComplaintReport, updateComplaintReport } from "@/api/ComplaintReport/ComplaintReport"

const { proxy } = getCurrentInstance()
const { ljsc, dansjd, tsjb, afds, sfnm } = proxy.useDict('ljsc', 'dansjd', 'tsjb', 'afds', 'sfnm')

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
    ],
    createTime: [
      { required: true, message: "投诉时间不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "更新时间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询投诉举报（用户投诉举报记录）列表 */
function getList() {
  loading.value = true
  listComplaintReport(queryParams.value).then(response => {
    ComplaintReportList.value = response.rows
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
  ids.value = selection.map(item => item.complaintId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加投诉举报（用户投诉举报记录）"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _complaintId = row.complaintId || ids.value
  getComplaintReport(_complaintId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改投诉举报（用户投诉举报记录）"
  })
}

/** 提交按钮 */
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

/** 删除按钮操作 */
function handleDelete(row) {
  const _complaintIds = row.complaintId || ids.value
  proxy.$modal.confirm('是否确认删除投诉举报（用户投诉举报记录）编号为"' + _complaintIds + '"的数据项？').then(function() {
    return delComplaintReport(_complaintIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('ComplaintReport/ComplaintReport/export', {
    ...queryParams.value
  }, `ComplaintReport_${new Date().getTime()}.xlsx`)
}

getList()
</script>
