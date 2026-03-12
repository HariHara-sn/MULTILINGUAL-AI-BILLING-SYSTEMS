import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor – attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('billing_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (err) => Promise.reject(err)
)

// Response interceptor – normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// ── Billing APIs ──────────────────────────────────────────────
export const generateBill = (text) =>
  api.post('/generate-bill', { text }).then(r => r.data)

export const confirmPurchase = (payload) =>
  api.post('/confirm-purchase', payload).then(r => r.data)

// ── Admin APIs ────────────────────────────────────────────────
export const getAllItems = () =>
  api.get('/get-all-items').then(r => r.data)

export const addItem = (item) =>
  api.post('/add-item', item).then(r => r.data)

export const updateItem = (item) =>
  api.patch('/update-item', item).then(r => r.data)

// ── Purchase History ──────────────────────────────────────────
export const getPurchaseHistory = (phone) =>
  api.get(`/get-purchase/${phone}`).then(r => r.data)


export default api
