import axios from 'axios'

const service = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // ⚠ 不带 cookie
})

// // 请求拦截器
// service.interceptors.request.use(
//   (config: any) => {
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// // 响应拦截器
service.interceptors.response.use(
  (response: any) => {
    // 后端一般格式 { code, data, message }
    const { code, data, message } = response.data

    if (code !== 1000) {
      return Promise.reject(message)
    }
    return data
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
