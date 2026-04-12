import request from '@/utils/request'

// 获取志愿者列表
export function getVolunteerList(params) {
  return request({
    url: '/admin/volunteer/list',
    method: 'get',
    params
  })
}

// 获取志愿者详情
export function getVolunteerDetail(id) {
  return request({
    url: `/admin/volunteer/${id}`,
    method: 'get'
  })
}

// 获取志愿者详情（用于编辑和查看页面）
export function getVolunteerById(id) {
  return request({
    url: `/admin/volunteer/${id}`,
    method: 'get'
  })
}

// 审核志愿者
export function approveVolunteer(id, data) {
  return request({
    url: `/admin/volunteer/${id}/approve`,
    method: 'put',
    data
  })
}

// 添加志愿者
export function addVolunteer(data) {
  return request({
    url: '/admin/volunteer',
    method: 'post',
    data
  })
}

// 更新志愿者信息
export function updateVolunteer(data) {
  return request({
    url: `/admin/volunteer/${data.id}`,
    method: 'put',
    data
  })
}

// 删除志愿者
export function deleteVolunteer(id) {
  return request({
    url: `/admin/volunteer/${id}`,
    method: 'delete'
  })
}

// 获取志愿者统计数据
export function getVolunteerStats() {
  return request({
    url: '/admin/volunteer/stats',
    method: 'get'
  })
}