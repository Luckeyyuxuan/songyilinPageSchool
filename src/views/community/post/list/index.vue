<template>
  <div class="community-list tech-page tech-grid-bg">
    <div class="tech-title">
      <span class="tech-gradient-text">爱心交流社区</span>
      <span class="tech-subtitle">分享经验，互助互爱</span>
    </div>

    <el-card shadow="hover" class="tech-card search-card">
      <template #header>
        <div class="card-header">
          <span class="section-title">
            <el-icon class="title-icon">
              <Search />
            </el-icon>
            搜索帖子
          </span>
          <el-button type="primary" class="tech-btn publish-btn" @click="handlePublish">
            <el-icon>
              <EditPen />
            </el-icon>
            发布帖子
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入帖子标题" class="tech-input">
            <template #prefix>
              <el-icon>
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="searchForm.author" placeholder="请输入作者" class="tech-input">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" class="tech-select">
            <el-option label="养宠经验" value="experience">
              <el-icon class="option-icon">
                <Star />
              </el-icon>
              养宠经验
            </el-option>
            <el-option label="问题求助" value="help">
              <el-icon class="option-icon">
                <QuestionFilled />
              </el-icon>
              问题求助
            </el-option>
            <el-option label="宠物趣事" value="fun">
              <el-icon class="option-icon">
                <ChatRound />
              </el-icon>
              宠物趣事
            </el-option>
            <el-option label="其他" value="other">
              <el-icon class="option-icon">
                <More />
              </el-icon>
              其他
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="tech-btn search-btn" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button class="reset-btn" @click="resetSearch">
            <el-icon>
              <RefreshRight />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 分类标签 -->
    <div class="category-tags">
      <el-tag
        v-for="cat in categories"
        :key="cat.value"
        :class="['category-tag', { active: searchForm.category === cat.value }]"
        @click="selectCategory(cat.value)"
      >
        <el-icon>
          <component :is="cat.icon" />
        </el-icon>
        {{ cat.label }}
      </el-tag>
    </div>

    <!-- 帖子卡片列表 -->
    <div class="post-cards">
      <el-card v-for="post in tableData" :key="post.postId" shadow="hover" class="tech-card post-card" @click="handleView(post.postId)">
        <div class="post-header">
          <div class="post-category-tag" :class="post.category">
            <el-icon>
              <component :is="getCategoryIcon(post.category)" />
            </el-icon>
            {{ getCategoryText(post.category) }}
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
        </div>

        <div class="post-content">
          <p class="post-excerpt">{{ removeHtmlTags(post.content).substring(0, 100) }}...</p>
        </div>

        <div class="post-footer">
          <div class="post-meta">
            <div class="author-info">
              <el-avatar :size="28" class="author-avatar">
                <el-icon>
                  <UserFilled />
                </el-icon>
              </el-avatar>
              <span class="author-name">{{ post.author }}</span>
            </div>
            <span class="post-time">
              <el-icon>
                <Clock />
              </el-icon>
              {{ formatTime(post.createTime) }}
            </span>
          </div>

          <div class="post-stats">
            <span class="post-stat">
              <el-icon>
                <ChatDotRound />
              </el-icon>
              {{ post.commentCount || 0 }}
            </span>
            <span class="post-stat">
              <el-icon>
                <Star />
              </el-icon>
              {{ post.likeCount || 0 }}
            </span>
            <span class="post-stat">
              <el-icon>
                <Collection />
              </el-icon>
              {{ post.collectCount || 0 }}
            </span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="tableData.length === 0" class="empty-state">
      <el-icon class="empty-icon">
        <ChatDotRound />
      </el-icon>
      <p>暂无帖子，快来发布第一个帖子吧！</p>
      <el-button type="primary" class="tech-btn" @click="handlePublish">
        <el-icon>
          <EditPen />
        </el-icon>
        发布帖子
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
import { getPostList } from '@/api/community/post'
import {
  ChatDotRound,
  Star,
  Collection,
  Search,
  EditPen,
  Document,
  User,
  RefreshRight,
  UserFilled,
  Clock,
  QuestionFilled,
  ChatRound,
  More
} from '@element-plus/icons-vue'

const router = useRouter()
const tableData = ref([])
const searchForm = reactive({
  title: '',
  author: '',
  category: ''
})
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const categories = [
  { value: '', label: '全部', icon: 'Collection' },
  { value: 'experience', label: '养宠经验', icon: 'Star' },
  { value: 'help', label: '问题求助', icon: 'QuestionFilled' },
  { value: 'fun', label: '宠物趣事', icon: 'ChatRound' },
  { value: 'other', label: '其他', icon: 'More' }
]

const getCategoryText = (category) => {
  switch (category) {
    case 'experience': return '养宠经验'
    case 'help': return '问题求助'
    case 'fun': return '宠物趣事'
    case 'other': return '其他'
    default: return category
  }
}

const getCategoryIcon = (category) => {
  switch (category) {
    case 'experience': return 'Star'
    case 'help': return 'QuestionFilled'
    case 'fun': return 'ChatRound'
    case 'other': return 'More'
    default: return 'Document'
  }
}

const selectCategory = (value) => {
  searchForm.category = value
  handleSearch()
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const removeHtmlTags = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

const loadData = async () => {
  try {
    const response = await getPostList({
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
  searchForm.category = ''
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
  router.push('/community/post/publish')
}

const handleView = (id) => {
  router.push(`/community/post/detail/${id}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/tech-theme.scss';

.community-list {
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
  .tech-input,
  .tech-select {
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

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;

  .category-tag {
    cursor: pointer;
    padding: 8px 16px;
    background: var(--tech-bg-card);
    border: 1px solid var(--tech-border);
    border-radius: 20px;
    color: var(--tech-text-secondary);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover,
    &.active {
      background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
      border-color: transparent;
      color: white;
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    }

    .el-icon {
      font-size: 16px;
    }
  }
}

.post-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.post-card {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--tech-shadow-lg);
  }

  .post-header {
    margin-bottom: 16px;

    .post-category-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 12px;

      &.experience {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
      }

      &.help {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }

      &.fun {
        background: rgba(236, 72, 153, 0.2);
        color: #ec4899;
      }

      &.other {
        background: rgba(148, 163, 184, 0.2);
        color: #94a3b8;
      }

      .el-icon {
        font-size: 14px;
      }
    }

    .post-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--tech-text-primary);
      margin: 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .post-content {
    .post-excerpt {
      font-size: 14px;
      color: var(--tech-text-secondary);
      line-height: 1.6;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid var(--tech-border);

    .post-meta {
      display: flex;
      align-items: center;
      gap: 16px;

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

      .post-time {
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

    .post-stats {
      display: flex;
      gap: 16px;

      .post-stat {
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

.option-icon {
  margin-right: 8px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .community-list {
    padding: 16px;
  }

  .tech-title .tech-gradient-text {
    font-size: 24px;
  }

  .post-cards {
    grid-template-columns: 1fr;
  }

  .category-tags {
    gap: 8px;

    .category-tag {
      padding: 6px 12px;
      font-size: 13px;
    }
  }

  .search-form {
    .el-form-item {
      width: 100%;
      margin-right: 0;

      .tech-input,
      .tech-select {
        width: 100%;
      }
    }
  }
}
</style>