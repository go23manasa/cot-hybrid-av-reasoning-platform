import axios from 'axios'

const API = axios.create({
  baseURL: '/api',   // 🔥 IMPORTANT
})

export const runScenario = (data) => API.post('/run', data)
export const runRAG = (data) => API.post('/run-rag', data)
export const compareModels = (data) => API.post('/compare', data)

export const getSummary = () => API.get('/analytics/summary')
export const getRiskAnalysis = () => API.get('/analytics/risk-analysis')
export const getWeather = () => API.get('/analytics/weather')
export const getDisagreements = () => API.get('/analytics/disagreements')