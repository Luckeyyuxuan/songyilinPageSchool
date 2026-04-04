<template>
  <div class="story-publish">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>发布故事</span>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="故事标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入故事标题" />
        </el-form-item>
        
        <el-form-item label="封面图片" prop="coverImage">
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleCoverUpload"
            :auto-upload="false"
            accept="image/*"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传故事封面图片
              </div>
            </template>
          </el-upload>
          <el-image
            v-if="form.coverImage"
            :src="form.coverImage"
            fit="cover"
            style="width: 200px; height: 150px; margin-top: 10px;"
          />
        </el-form-item>
        
        <el-form-item label="故事内容" prop="content">
          <el-editor v-model="form.content" style="min-height: 300px" />
        </el-form-item>
        
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者姓名" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">发布故事</el-button>
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
import { publishStory } from '@/api/story/story'

const router = useRouter()
const formRef = ref()
const form = reactive({
  title: '',
  coverImage: '',
  content: '',
  author: ''
})

const rules = {
  title: [{ required: true, message: '请输入故事标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入故事内容', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者姓名', trigger: 'blur' }]
}

const handleCoverUpload = (file) => {
  // 这里应该实现图片上传逻辑，暂时使用本地预览
  const reader = new FileReader()
  reader.onload = (e) => {
    form.coverImage = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await publishStory(form)
        ElMessage.success('故事发布成功')
        router.push('/story/list')
      } catch (error) {
        ElMessage.error('故事发布失败')
      }
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  form.coverImage = ''
}
</script>

<style scoped>
.story-publish {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-demo {
  margin-bottom: 10px;
}
</style>