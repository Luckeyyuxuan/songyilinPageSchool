<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公告类型" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="请选择公告类型" clearable>
          <el-option
            v-for="dict in gglx"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="目标用户" prop="targetUserType">
        <el-select v-model="queryParams.targetUserType" placeholder="请选择目标用户" clearable>
          <el-option
            v-for="dict in mbyhlx"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否弹窗" prop="isPopup">
        <el-select v-model="queryParams.isPopup" placeholder="请选择是否弹窗" clearable>
          <el-option
            v-for="dict in sftc"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布人ID" prop="publishUserId">
        <el-input
          v-model="queryParams.publishUserId"
          placeholder="请输入发布人ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker clearable
          v-model="queryParams.publishTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下架时间" prop="offlineTime">
        <el-date-picker clearable
          v-model="queryParams.offlineTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择下架时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="查看次数" prop="viewCount">
        <el-input
          v-model="queryParams.viewCount"
          placeholder="请输入查看次数"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['NoticeInfo:NoticeInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['NoticeInfo:NoticeInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['NoticeInfo:NoticeInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['NoticeInfo:NoticeInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="NoticeInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="noticeId" />
      <el-table-column label="公告标题" align="center" prop="noticeTitle" />
      <el-table-column label="公告类型" align="center" prop="noticeType">
        <template #default="scope">
          <dict-tag :options="gglx" :value="scope.row.noticeType"/>
        </template>
      </el-table-column>
      <el-table-column label="公告内容" align="center" prop="noticeContent">
        <template #default="scope">
          <div v-html="scope.row.noticeContent"></div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="目标用户" align="center" prop="targetUserType"> -->
        <!-- <template #default="scope">
          <dict-tag :options="mbyhlx" :value="scope.row.targetUserType"/>
        </template>
      </el-table-column> -->
      <el-table-column label="是否弹窗" align="center" prop="isPopup">
        <template #default="scope">
          <dict-tag :options="sftc" :value="scope.row.isPopup"/>
        </template>
      </el-table-column>
      <el-table-column label="发布人ID" align="center" prop="publishUserId" />
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下架时间" align="center" prop="offlineTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.offlineTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看次数" align="center" prop="viewCount" />
      <el-table-column label="逻辑删除" align="center" prop="isDeleted">
        <template #default="scope">
          <dict-tag :options="ljsc" :value="scope.row.isDeleted"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['NoticeInfo:NoticeInfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['NoticeInfo:NoticeInfo:remove']">删除</el-button>
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

    <!-- 添加或修改公告信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="NoticeInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公告标题" prop="noticeTitle">
          <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="公告类型" prop="noticeType">
          <el-select v-model="form.noticeType" placeholder="请选择公告类型">
            <el-option
              v-for="dict in gglx"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容" prop="noticeContent">
          <editor v-model="form.noticeContent" :min-height="192"/>
        </el-form-item>
        <!-- <el-form-item label="目标用户" prop="targetUserType">
          <el-select v-model="form.targetUserType" placeholder="请选择目标用户">
            <el-option
              v-for="dict in mbyhlx"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否弹窗" prop="isPopup">
          <el-select v-model="form.isPopup" placeholder="请选择是否弹窗">
            <el-option
              v-for="dict in sftc"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布人ID" prop="publishUserId">
          <el-input v-model="form.publishUserId" placeholder="请输入发布人ID" />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker clearable
            v-model="form.publishTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下架时间" prop="offlineTime">
          <el-date-picker clearable
            v-model="form.offlineTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择下架时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="查看次数" prop="viewCount">
          <el-input v-model="form.viewCount" placeholder="请输入查看次数" />
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

/** 查询公告信息列表 */
function getList() {
  loading.value = true
  listNoticeInfo(queryParams.value).then(response => {
    NoticeInfoList.value = response.rows
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
  ids.value = selection.map(item => item.noticeId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加公告信息"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _noticeId = row.noticeId || ids.value
  getNoticeInfo(_noticeId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改公告信息"
  })
}

/** 提交按钮 */
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

/** 删除按钮操作 */
function handleDelete(row) {
  const _noticeIds = row.noticeId || ids.value
  proxy.$modal.confirm('是否确认删除公告信息编号为"' + _noticeIds + '"的数据项？').then(function() {
    return delNoticeInfo(_noticeIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('NoticeInfo/NoticeInfo/export', {
    ...queryParams.value
  }, `NoticeInfo_${new Date().getTime()}.xlsx`)
}

getList()
</script>
