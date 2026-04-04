import { createWebHistory, createRouter } from 'vue-router'
/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  // 领养申请模块
  {
    path: '/adoption',
    component: Layout,
    meta: { title: '领养申请', icon: 'peoples' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/adoption/list/index.vue'),
        name: 'AdoptionList',
        meta: { title: '申请列表' }
      },
      {
        path: 'application',
        component: () => import('@/views/adoption/application/index.vue'),
        name: 'AdoptionApplication',
        meta: { title: '提交申请' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/adoption/detail/index.vue'),
        name: 'AdoptionDetail',
        hidden: true,
        meta: { title: '申请详情', activeMenu: '/adoption/list' }
      }
    ]
  },
  // 物资捐赠模块
  {
    path: '/donation',
    component: Layout,
    meta: { title: '物资捐赠', icon: 'shopping' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/donation/list/index.vue'),
        name: 'DonationList',
        meta: { title: '捐赠列表' }
      },
      {
        path: 'application',
        component: () => import('@/views/donation/application/index.vue'),
        name: 'DonationApplication',
        meta: { title: '提交捐赠' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/donation/detail/index.vue'),
        name: 'DonationDetail',
        hidden: true,
        meta: { title: '捐赠详情', activeMenu: '/donation/list' }
      }
    ]
  },
  // 故事会模块
  {
    path: '/story',
    component: Layout,
    meta: { title: '故事会', icon: 'documentation' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/story/list/index.vue'),
        name: 'StoryList',
        meta: { title: '故事列表' }
      },
      {
        path: 'publish',
        component: () => import('@/views/story/publish/index.vue'),
        name: 'StoryPublish',
        meta: { title: '发布故事' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/story/detail/index.vue'),
        name: 'StoryDetail',
        hidden: true,
        meta: { title: '故事详情', activeMenu: '/story/list' }
      }
    ]
  },
  // 爱心交流社区模块
  {
    path: '/community',
    component: Layout,
    meta: { title: '爱心交流社区', icon: 'message' },
    children: [
      {
        path: 'post/list',
        component: () => import('@/views/community/post/list/index.vue'),
        name: 'PostList',
        meta: { title: '帖子列表' }
      },
      {
        path: 'post/publish',
        component: () => import('@/views/community/post/publish/index.vue'),
        name: 'PostPublish',
        meta: { title: '发布帖子' }
      },
      {
        path: 'post/detail/:id',
        component: () => import('@/views/community/post/detail/index.vue'),
        name: 'PostDetail',
        hidden: true,
        meta: { title: '帖子详情', activeMenu: '/community/post/list' }
      }
    ]
  },
  // 管理员端模块
  {
    path: '/admin',
    component: Layout,
    meta: { title: '管理员管理', icon: 'system' },
    children: [
      {
        path: 'volunteer',
        component: () => import('@/views/admin/volunteer/index.vue'),
        name: 'VolunteerList',
        meta: { title: '志愿者管理' }
      },
      {
        path: 'organization',
        component: () => import('@/views/admin/organization/index.vue'),
        name: 'OrganizationList',
        meta: { title: '合作机构管理' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

export default router;
