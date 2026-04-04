import request from '@/utils/request'

// 查询投诉举报（用户投诉举报记录）列表
export function listComplaintReport(query) {
  return request({
    url: '/ComplaintReport/ComplaintReport/list',
    method: 'get',
    params: query
  })
}

// 查询投诉举报（用户投诉举报记录）详细
export function getComplaintReport(complaintId) {
  return request({
    url: '/ComplaintReport/ComplaintReport/' + complaintId,
    method: 'get'
  })
}

// 新增投诉举报（用户投诉举报记录）
export function addComplaintReport(data) {
  return request({
    url: '/ComplaintReport/ComplaintReport',
    method: 'post',
    data: data
  })
}

// 修改投诉举报（用户投诉举报记录）
export function updateComplaintReport(data) {
  return request({
    url: '/ComplaintReport/ComplaintReport',
    method: 'put',
    data: data
  })
}

// 删除投诉举报（用户投诉举报记录）
export function delComplaintReport(complaintId) {
  return request({
    url: '/ComplaintReport/ComplaintReport/' + complaintId,
    method: 'delete'
  })
}
