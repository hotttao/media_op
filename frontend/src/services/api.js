import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 达人相关API
export const creatorAPI = {
  // 获取达人列表
  getCreators: () => api.get('/creators'),
  
  // 获取达人商品分析数据
  getCreatorProducts: (userId, params) => 
    api.get(`/creators/${userId}/products`, { params }),
};

// 商品相关API
export const productAPI = {
  // 获取商品视频分析数据
  getProductVideos: (productId, params) => 
    api.get(`/products/${productId}/videos`, { params }),
  
  // 获取商品矩阵数据
  getProductMatrix: (params) => 
    api.get('/products/matrix', { params }),
  
  // 搜索商品
  searchProducts: (keyword) => 
    api.get('/products/search', { params: { keyword } }),
};

// 分类相关API
export const categoryAPI = {
  // 获取一级分类列表
  getCategories: () => api.get('/categories'),
};

export default api;