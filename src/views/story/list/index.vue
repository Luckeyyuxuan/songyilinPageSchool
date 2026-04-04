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
}

.tech-title {
  margin-bottom: 24px;
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
    color: var(--tech-text-secondary);
  }
}

.tech-card {
  margin-bottom: 24px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--tech-text-primary);
      
      .title-icon {
        color: var(--tech-primary);
        font-size: 20px;
      }
    }
    
    .publish-btn {
      background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
      border: none;
      padding: 10px 20px;
      
      &:hover {
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
      }
    }
  }
}

.search-form {
  .tech-input {
    :deep(.el-input__wrapper) {
      background: var(--tech-bg-light);
      border: 1px solid var(--tech-border);
      border-radius: 8px;
      
      .el-input__prefix {
        color: var(--tech-primary);
      }
    }
  }
  
  .search-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    
    &:hover {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }
  }
  
  .reset-btn {
    background: transparent;
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);
    
    &:hover {
      border-color: var(--tech-primary);
      color: var(--tech-primary);
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
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--tech-shadow-lg);
    
    .story-overlay {
      opacity: 1;
    }
    
    .story-cover {
      transform: scale(1.05);
    }
  }
  
  .story-image-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
    border-radius: 8px;
    margin: -20px -20px 16px -20px;
    
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
      background: var(--tech-bg-light);
      color: var(--tech-text-muted);
      font-size: 48px;
    }
    
    .story-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      
      .view-btn {
        background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
        border: none;
        padding: 10px 20px;
        
        &:hover {
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
        }
      }
    }
  }
  
  .story-content {
    .story-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--tech-text-primary);
      margin: 0 0 12px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .story-excerpt {
      font-size: 14px;
      color: var(--tech-text-secondary);
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
          background: var(--tech-bg-light);
          border: 1px solid var(--tech-border);
          color: var(--tech-primary);
        }
        
        .author-name {
          font-size: 14px;
          color: var(--tech-text-secondary);
        }
      }
      
      .story-time {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--tech-text-muted);
        
        .el-icon {
          font-size: 14px;
        }
      }
    }
    
    .story-stats {
      display: flex;
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--tech-border);
      
      .story-stat {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--tech-text-muted);
        
        .el-icon {
          font-size: 16px;
          color: var(--tech-primary);
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
  
  .empty-icon {
    font-size: 80px;
    color: var(--tech-text-muted);
    margin-bottom: 20px;
  }
  
  p {
    font-size: 16px;
    color: var(--tech-text-secondary);
    margin-bottom: 24px;
  }
  
  .tech-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
    border: none;
    padding: 12px 32px;
    
    &:hover {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }
  }
}

.tech-pagination {
  justify-content: center;
  margin-top: 32px;
  
  :deep(.el-pagination__total),
  :deep(.el-pagination__jump) {
    color: var(--tech-text-secondary);
  }
  
  :deep(.el-pager li) {
    background: var(--tech-bg-light);
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);
    
    &:hover,
    &.is-active {
      background: var(--tech-primary);
      border-color: var(--tech-primary);
      color: white;
    }
  }
  
  :deep(.btn-prev),
  :deep(.btn-next) {
    background: var(--tech-bg-light);
    border: 1px solid var(--tech-border);
    color: var(--tech-text-secondary);
    
    &:hover {
      color: var(--tech-primary);
    }
  }
  
  :deep(.el-input__wrapper) {
    background: var(--tech-bg-light);
    border: 1px solid var(--tech-border);
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
