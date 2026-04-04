import request from '@/utils/request'

// 查询救助信息列表
export function listGive(query) {
  return request({
    url: '/give/give/list',
    method: 'get',
    params: query
  })
}

// 查询救助信息详细
export function getGive(rescueId) {
  return request({
    url: '/give/give/' + rescueId,
    method: 'get'
  })
}

// 新增救助信息
export function addGive(data) {
  return request({
    url: '/give/give',
    method: 'post',
    data: data
  })
}

// 修改救助信息
export function updateGive(data) {
  return request({
    url: '/give/give',
    method: 'put',
    data: data
  })
}

// 删除救助信息
export function delGive(rescueId) {
  return request({
    url: '/give/give/' + rescueId,
    method: 'delete'
  })
}
