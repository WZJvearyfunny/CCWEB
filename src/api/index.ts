import request from '~/axios/request'

export function getMessageList(param: any) {
  return request.post<any>(`/message/pageList`, param)
}

export function getHistoryList(param: any) {
  return request.get<any>(`/user/history?openId=${param.openId}`)
}

export function groupByChannel(param: any) {
  return request.post<any>(`/user/groupByChannel`, param)
}

export function groupByChannelReal(param: any) {
  return request.post<any>(`/message/groupByChannel`, param)
}

export function login(data: { phone: string, code: string }) {
  return request.post<{ token: string }>('/login', data)
}
