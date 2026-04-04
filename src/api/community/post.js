import request from '@/utils/request'

// 发布帖子
export function publishPost(data) {
  return request({
    url: '/community/post/publish',
    method: 'post',
    data
  })
}

// 获取帖子列表
export function getPostList(params) {
  return request({
    url: '/community/post/list',
    method: 'get',
    params
  })
}

// 获取帖子详情
export function getPostDetail(id) {
  return request({
    url: `/community/post/${id}`,
    method: 'get'
  })
}

// 点赞帖子
export function likePost(id) {
  return request({
    url: `/community/post/${id}/like`,
    method: 'post'
  })
}

// 评论帖子
export function commentPost(id, data) {
  return request({
    url: `/community/post/${id}/comment`,
    method: 'post',
    data
  })
}

// 获取帖子评论列表
export function getPostComments(id, params) {
  return request({
    url: `/community/post/${id}/comments`,
    method: 'get',
    params
  })
}

// 删除帖子
export function deletePost(id) {
  return request({
    url: `/community/post/${id}`,
    method: 'delete'
  })
}

// 收藏帖子
export function collectPost(id) {
  return request({
    url: `/community/post/${id}/collect`,
    method: 'post'
  })
}

// 获取收藏列表
export function getCollectionList(params) {
  return request({
    url: '/community/collection/list',
    method: 'get',
    params
  })
}