<template>
  <div class="story-list tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">故事会</span>
      <span class="tech-subtitle">分享温暖，传递爱心</span>
    </div>
    
    <el-card shadow="hover" class="tech-card search-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon"><Search /></el-icon>
            搜索故事
          </span>
          <el-button type="primary" class="tech-btn publish-btn" @click="handlePublish">
            <el-icon><EditPen /></el-icon>
            发布故事
          </el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入故事标题" class="tech-input">
            <template #prefix>
              <el-icon><Document /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="searchForm.author" placeholder="请输入作者" class="tech-input">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
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
    </el-card>
    
    <!-- 故事卡片列表 -->
    <div class="story-cards">
      <el-card
        v-for="story in tableData"
        :key="story.id"
        shadow="hover"
        class="tech-card story-card"
        @click="handleView(story.id)"
      >
        <div class="story-image-wrapper">
          <el-image
            v-if="story.coverImage"
            :src="story.coverImage"
            fit="cover"
            class="story-cover"
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
          <div class="story-overlay">
            <el-button type="primary" class="view-btn">
              <el-icon><View /></el-icon>
              阅读全文
            </el-button>
          </div>
        </div>
        
        <div class="story-content">
          <h3 class="story-title">{{ story.title }}</h3>
          <p class="story-excerpt">{{ story.content.substring(0, 80) }}...</p>
          
          <div class="story-meta">
            <div class="author-info">
              <el-avatar :size="32" class="author-avatar">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <span class="author-name">{{ story.author }}</span>
            </div>
            <span class="story-time">
              <el-icon><Clock /></el-icon>
              {{ formatTime(story.createTime) }}
            </span>
          </div>
          
          <div class="story-stats">
            <span class="story-stat">
              <el-icon><ChatDotRound /></el-icon>
              {{ story.commentCount || 0 }}
            </span>
            <span class="story-stat">
              <el-icon><Star /></el-icon>
              {{ story.likeCount || 0 }}
            </span>
            <span class="story-stat">
              <el-icon><View /></el-icon>
              {{ story.viewCount || 0 }}
            </span>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 空状态 -->
    <div v-if="tableData.length === 0" class="empty-state">
      <el-icon class="empty-icon"><DocumentDelete /></el-icon>
      <p>暂无故事，快来发布第一个故事吧！</p>
      <el-button type="primary" class="tech-btn" @click="handlePublish">
        <el-icon><EditPen /></el-icon>
        发布故事
      </el-button>
    </div>
    
    <!-- 分页 -->
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getStoryList } from '@/api/story/story'
import { 
  ChatDotRound, 
  Star, 
  Search,
  EditPen,
  Document,
  User,
  RefreshRight,
  Picture,
  View,
  UserFilled,
  Clock,
  DocumentDelete
} from '@element-plus/icons-vue'

const router = useRouter()
const tableData = ref([])
const searchForm = reactive({
  title: '',
  author: ''
})
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadData = async () => {
  try {
    const response = await getStoryList({
      ...searchForm,
      pageNum: pagination.current,
      pageSize: pagination.size
    })
    tableData.value = response.rows
    pagination.total = response.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const resetSearch = () => {
  searchForm.title = ''
  searchForm.author = ''
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

const handlePublish = () => {
  router.push('/story/publish')
}

const handleView = (id) => {
  router.push(`/story/detail/${id}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.story-list {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #0a0e27 0%, #111936 100%);
}

.tech-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .tech-gradient-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .tech-subtitle {
    font-size: 16px;
    color: #64748b;
    font-weight: 400;
  }
}

.tech-card {
  background: rgba(17, 25, 54, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 12px;
  margin-bottom: 24px;
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
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 600;
      color: #00d4ff;
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
      
      .title-icon {
        color: #7c3aed;
        font-size: 22px;
      }
    }
    
    .publish-btn {
      background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
      border: none;
      padding: 10px 20px;
      font-weight: 500;
      
      &:hover {
        background: linear-gradient(135deg, #00c4e8 0%, #6d34d1 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
      }
    }
  }
}

.search-form {
  .el-form-item {
    :deep(.el-form-item__label) {
      color: #94a3b8;
      font-weight: 500;
    }
  }
  
  .tech-input {
    :deep(.el-input__wrapper) {
      background: rgba(30, 39, 70, 0.8);
      border: 1px solid rgba(0, 212, 255, 0.25);
      border-radius: 8px;
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
      
      .el-input__inner {
        color: #e2e8f0;
        font-weight: 500;
      }
      
      .el-input__prefix {
        color: #00d4ff;
      }
    }
  }
  
  .search-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    font-weight: 500;
    
    &:hover {
      background: linear-gradient(135deg, #00c4e8 0%, #6d34d1 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
    }
  }
  
  .reset-btn {
    background: rgba(30, 39, 70, 0.8);
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

.story-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.story-card {
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background: rgba(17, 25, 54, 0.9);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 12px 40px rgba(0, 212, 255, 0.15);
    
    .story-overlay {
      opacity: 1;
    }
    
    .story-cover {
      transform: scale(1.05);
    }
  }
  
  :deep(.el-card__body) {
    padding: 0;
  }
  
  .story-image-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
    
    .story-cover {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
    }
    
    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(30, 39, 70, 0.8);
      color: #64748b;
      font-size: 48px;
    }
    
    .story-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      
      .view-btn {
        background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
        border: none;
        padding: 10px 20px;
        font-weight: 500;
        
        &:hover {
          background: linear-gradient(135deg, #00c4e8 0%, #6d34d1 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
        }
      }
    }
  }
  
  .story-content {
    padding: 20px;
    
    .story-title {
      font-size: 18px;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 12px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .story-excerpt {
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .story-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .author-info {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .author-avatar {
          background: rgba(30, 39, 70, 0.8);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
        }
        
        .author-name {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 500;
        }
      }
      
      .story-time {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #64748b;
        font-family: 'Courier New', monospace;
        
        .el-icon {
          font-size: 14px;
          color: #00d4ff;
        }
      }
    }
    
    .story-stats {
      display: flex;
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(0, 212, 255, 0.15);
      
      .story-stat {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #64748b;
        font-weight: 500;
        
        .el-icon {
          font-size: 16px;
          color: #00d4ff;
          filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.3));
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: rgba(17, 25, 54, 0.6);
  border: 1px dashed rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  margin: 40px 0;
  
  .empty-icon {
    font-size: 80px;
    color: #64748b;
    margin-bottom: 20px;
    filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.2));
  }
  
  p {
    font-size: 16px;
    color: #94a3b8;
    margin-bottom: 24px;
  }
  
  .tech-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    padding: 12px 32px;
    font-weight: 500;
    
    &:hover {
      background: linear-gradient(135deg, #00c4e8 0%, #6d34d1 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
    }
  }
}

.tech-pagination {
  justify-content: center;
  margin-top: 32px;
  
  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    color: #94a3b8;
  }
  
  :deep(.el-pager li) {
    background: rgba(30, 39, 70, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.25);
    color: #94a3b8;
    border-radius: 6px;
    
    &:hover {
      background: rgba(0, 212, 255, 0.15);
      border-color: #00d4ff;
      color: #00d4ff;
    }
    
    &.is-active {
      background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
      border-color: transparent;
      color: white;
      box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
    }
  }
  
  :deep(.btn-prev),
  :deep(.btn-next) {
    background: rgba(30, 39, 70, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.25);
    color: #94a3b8;
    border-radius: 6px;
    
    &:hover {
      background: rgba(0, 212, 255, 0.15);
      border-color: #00d4ff;
      color: #00d4ff;
    }
  }
  
  :deep(.el-input__wrapper) {
    background: rgba(30, 39, 70, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.25);
    box-shadow: none;
    
    &:hover {
      border-color: rgba(0, 212, 255, 0.5);
    }
    
    &.is-focus {
      border-color: #00d4ff;
      box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15);
    }
    
    .el-input__inner {
      color: #e2e8f0;
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  .story-list {
    padding: 16px;
  }
  
  .tech-title .tech-gradient-text {
    font-size: 24px;
  }
  
  .story-cards {
    grid-template-columns: 1fr;
  }
  
  .search-form {
    .el-form-item {
      width: 100%;
      margin-right: 0;
      
      .tech-input {
        width: 100%;
      }
    }
  }
}
</style>
