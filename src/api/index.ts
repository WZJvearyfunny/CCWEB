import request from '~/axios/request'

// GET 请求留言列表
export function getMessageList(param: any) {
  return request.post<any>(`/message/pageList`, param)
}

// POST 示例
export function login(data: { phone: string, code: string }) {
  return request.post<{ token: string }>('/login', data)
}
