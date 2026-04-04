<template>
  <div class="community-publish">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>发布帖子</span>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="帖子标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入帖子标题" />
        </el-form-item>
        
        <el-form-item label="帖子分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择帖子分类">
            <el-option label="养宠经验" value="experience" />
            <el-option label="问题求助" value="help" />
            <el-option label="宠物趣事" value="fun" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="帖子内容" prop="content">
          <el-editor v-model="form.content" style="min-height: 300px" />
        </el-form-item>
        
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者姓名" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">发布帖子</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { publishPost } from '@/api/community/post'

const router = useRouter()
const formRef = ref()
const form = reactive({
  title: '',
  category: '',
  content: '',
  author: ''
})

const rules = {
  title: [{ required: true, message: '请输入帖子标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择帖子分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入帖子内容', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者姓名', trigger: 'blur' }]
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await publishPost(form)
        ElMessage.success('帖子发布成功')
        router.push('/community/post/list')
      } catch (error) {
        ElMessage.error('帖子发布失败')
      }
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
</script>

<style scoped>
.community-publish {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>