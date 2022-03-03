/*
* 基于 axios 封装的请求模块
* */
import axios from 'axios'

// 创建一个 axios 实例（复制 axios）
// 我们通过这个实例去发请求，把需要的配置给这个实例来做
const request = axios.create({
  baseURL: ''
})

//请求拦截器

//导出 request
export default request

//