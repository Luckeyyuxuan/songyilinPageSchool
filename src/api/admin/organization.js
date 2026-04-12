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

// 获取合作机构详情（用于编辑和查看页面）
export function getOrganizationById(id) {
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
    params: {
      orgId: id
    },
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
export function updateOrganization(data) {
  return request({
    url: `/admin/organization/${data.id}`,
    method: 'put',
    params: {
      orgId: data.id
    },
    data
  })
}

// 删除合作机构
export function deleteOrganization(id) {
  return request({
    url: `/admin/organization/${id}`,
    method: 'delete',
    params: {
      orgId: id
    }
  })
}

// 获取合作机构统计数据
export function getOrganizationStats() {
  return request({
    url: '/admin/organization/stats',
    method: 'get'
  })
}