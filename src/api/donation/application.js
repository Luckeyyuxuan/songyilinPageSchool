import request from '@/utils/request'

// 提交物资捐赠申请
export function submitDonationApplication(data) {
  return request({
    url: '/donation/application/submit',
    method: 'post',
    data
  })
}

// 获取物资捐赠列表
export function getDonationList(params) {
  return request({
    url: '/donation/application/list',
    method: 'get',
    params
  })
}

// 获取物资捐赠详情
export function getDonationDetail(id) {
  return request({
    url: `/donation/application/${id}`,
    method: 'get'
  })
}

// 确认收到捐赠
export function confirmDonation(id) {
  return request({
    url: `/donation/application/${id}/confirm`,
    method: 'put'
  })
}

// 取消捐赠
export function cancelDonation(id) {
  return request({
    url: `/donation/application/${id}/cancel`,
    method: 'put'
  })
}