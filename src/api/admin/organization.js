import request from '@/utils/request'

// 获取合作机构列表
export function getOrganizationList(params) {
  return request({
    url: '/admin/organization/list',
    method: 'get',
    params
  })
}

// 获取合作机构详情
export function getOrganizationDetail(id) {
  return request({
    url: `/admin/organization/${id}`,
    method: 'get'
  })
}

// 审核合作机构
export function approveOrganization(id, data) {
  return request({
    url: `/admin/organization/${id}/approve`,
    method: 'put',
    data
  })
}

// 添加合作机构
export function addOrganization(data) {
  return request({
    url: '/admin/organization',
    method: 'post',
    data
  })
}

// 更新合作机构信息
export function updateOrganization(id, data) {
  return request({
    url: `/admin/organization/${id}`,
    method: 'put',
    data
  })
}

// 删除合作机构
export function deleteOrganization(id) {
  return request({
    url: `/admin/organization/${id}`,
    method: 'delete'
  })
}

// 获取合作机构统计数据
export function getOrganizationStats() {
  return request({
    url: '/admin/organization/stats',
    method: 'get'
  })
}