import request from '@/utils/request'

// 提交领养申请
export function submitAdoptionApplication(data) {
  return request({
    url: '/adoption/application/submit',
    method: 'post',
    data
  })
}

// 下载领养协议模板
export function downloadAgreementTemplate() {
  return request({
    url: '/adoption/agreement/download',
    method: 'get',
    responseType: 'blob'
  })
}

// 获取领养申请列表
export function getAdoptionList(params) {
  return request({
    url: '/adoption/application/list',
    method: 'get',
    params
  })
}

// 获取领养申请详情
export function getAdoptionDetail(id) {
  return request({
    url: `/adoption/application/${id}`,
    method: 'get'
  })
}

// 审批领养申请
export function approveAdoption(id, data) {
  return request({
    url: `/adoption/application/${id}/approve`,
    method: 'put',
    data
  })
}

// 上传签署后的协议
export function uploadAgreement(id, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: `/adoption/application/${id}/agreement`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}