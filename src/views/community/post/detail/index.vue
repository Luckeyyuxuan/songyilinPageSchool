<template>
  <div class="community-detail">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>帖子详情</span>
          <el-button type="primary" @click="goBack">返回列表</el-button>
        </div>
      </template>
      
      <div class="post-content">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span class="post-author">作者：{{ post.author }}</span>
          <span class="post-time">{{ post.createTime }}</span>
          <el-tag size="small">{{ getCategoryText(post.category) }}</el-tag>
        </div>
        <div class="post-body" v-html="post.content"></div>
        <div class="post-actions">
          <el-button type="primary" @click="handleLike" :icon="isLiked ? 'StarFilled' : 'Star'">
            {{ isLiked ? '已点赞' : '点赞' }} ({{ post.likeCount || 0 }})
          </el-button>
          <el-button type="default" @click="handleCollect" :icon="isCollected ? 'CollectionFilled' : 'Collection'">
            {{ isCollected ? '已收藏' : '收藏' }} ({{ post.collectCount || 0 }})
          </el-button>
          <el-button type="default" @click="showCommentInput = !showCommentInput" :icon="'ChatDotRound'">
            评论 ({{ post.commentCount || 0 }})
          </el-button>
        </div>
      </div>
      
      <!-- 评论输入 -->
      <div v-if="showCommentInput" class="comment-input">
        <el-form :model="commentForm" :rules="commentRules" ref="commentFormRef">
          <el-form-item prop="content">
            <el-input type="textarea" v-model="commentForm.content" placeholder="请输入评论内容" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitComment">提交评论</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 评论列表 -->
      <el-divider content-position="left">评论</el-divider>
      <div class="comment-list">
        <div v-if="comments.length === 0" class="no-comments">暂无评论</div>
        <el-card
          v-for="comment in comments"
          :key="comment.id"
          shadow="hover"
          class="comment-item"
        >
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-time">{{ comment.createTime }}</span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
        </el-card>
      </div>
      
      <el-pagination
        v-if="comments.length > 0"
        v-model:current-page="commentPagination.current"
        v-model:page-size="commentPagination.size"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="commentPagination.total"
        @size-change="handleCommentSizeChange"
        @current-change="handleCommentCurrentChange"
        style="margin-top: 20px"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getPostDetail, likePost, commentPost, getPostComments, collectPost } from '@/api/community/post'

const route = useRoute()
const router = useRouter()
const post = ref({})
const comments = ref([])
const isLiked = ref(false)
const isCollected = ref(false)
const showCommentInput = ref(false)
const commentForm = reactive({ content: '' })
const commentFormRef = ref()
const commentPagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const commentRules = {
  content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }]
}

const getCategoryText = (category) => {
  switch (category) {
    case 'experience': return '养宠经验'
    case 'help': return '问题求助'
    case 'fun': return '宠物趣事'
    case 'other': return '其他'
    default: return category
  }
}

const loadPostDetail = async () => {
  try {
    const response = await getPostDetail(route.params.postId)
    post.value = response.data || response
  } catch (error) {
    ElMessage.error('获取帖子详情失败')
  }
}

const loadComments = async () => {
  try {
    const response = await getPostComments(route.params.postId, {
      pageNum: commentPagination.current,
      pageSize: commentPagination.size
    })
    comments.value = response.rows
    commentPagination.total = response.total
  } catch (error) {
    ElMessage.error('获取评论失败')
  }
}

const handleLike = async () => {
  try {
    await likePost(route.params.postId)
    isLiked.value = !isLiked.value
    post.value.likeCount = (post.value.likeCount || 0) + (isLiked.value ? 1 : -1)
    ElMessage.success(isLiked.value ? '点赞成功' : '取消点赞成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleCollect = async () => {
  try {
    await collectPost(route.params.postId)
    isCollected.value = !isCollected.value
    post.value.collectCount = (post.value.collectCount || 0) + (isCollected.value ? 1 : -1)
    ElMessage.success(isCollected.value ? '收藏成功' : '取消收藏成功')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const submitComment = async () => {
  if (!commentFormRef.value) return
  await commentFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await commentPost(route.params.postId, commentForm)
        ElMessage.success('评论成功')
        showCommentInput.value = false
        commentForm.content = ''
        loadComments()
        post.value.commentCount = (post.value.commentCount || 0) + 1
      } catch (error) {
        ElMessage.error('评论失败')
      }
    }
  })
}

const handleCommentSizeChange = (size) => {
  commentPagination.size = size
  loadComments()
}

const handleCommentCurrentChange = (current) => {
  commentPagination.current = current
  loadComments()
}

const goBack = () => {
  router.push('/community/post/list')
}

onMounted(() => {
  loadPostDetail()
  loadComments()
})
</script>

<style scoped>
.community-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.post-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  color: #999;
  align-items: center;
}

.post-body {
  line-height: 1.8;
  color: #333;
  margin-bottom: 30px;
}

.post-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.comment-input {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-item {
  margin-bottom: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
}

.comment-time {
  color: #999;
  font-size: 14px;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>