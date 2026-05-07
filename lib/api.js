import api from './axios';

// Admin APIs
export const adminApi = {
  // Users
  getUsers: () => api.get('/api/admin/users').then(res => res.data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`).then(res => res.data),
  
  // Posts
  getPosts: () => api.get('/api/admin/posts').then(res => res.data),
  
  // Analytics
  getAnalytics: () => api.get('/api/admin/analytics').then(res => res.data),
};

// Posts APIs
export const postsApi = {
  getAll: () => api.get('/api/posts').then(res => res.data),
  getBySlug: (slug) => api.get(`/api/posts/singlepost/${slug}`).then(res => res.data),
  getByUser: (userId) => api.get(`/api/posts/user/${userId}`).then(res => res.data),
  search: (query) => api.get(`/api/posts/search?q=${encodeURIComponent(query)}`).then(res => res.data),
  create: (data) => api.post('/api/posts/new', data).then(res => res.data),
  update: (id, data) => api.put(`/api/posts/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/api/posts/${id}`).then(res => res.data),
  incrementViews: (slug) => api.post(`/api/posts/${slug}/views`).then(res => res.data),
};

// Comments APIs
export const commentsApi = {
  getByPost: (postId) => api.get(`/api/comments?postId=${postId}`).then(res => res.data),
  create: (data) => api.post('/api/comments', data).then(res => res.data),
  delete: (id) => api.delete(`/api/comments/delete/${id}`).then(res => res.data),
  likeDislike: (commentId, data) => api.patch(`/api/comments/${commentId}/likeDislike`, data).then(res => res.data),
};

// Bookmarks APIs
export const bookmarksApi = {
  getAll: () => api.get('/api/bookmarks').then(res => res.data),
  add: (postId) => api.post(`/api/bookmarks/${postId}`).then(res => res.data),
  remove: (postId) => api.delete(`/api/bookmarks/${postId}`).then(res => res.data),
  check: (postId) => api.get(`/api/bookmarks/${postId}`).then(res => res.data),
};

// User APIs
export const userApi = {
  updateProfile: (data) => api.put('/api/user/profile', data).then(res => res.data),
  signup: (data) => api.post('/api/signup', data).then(res => res.data),
};

// Upload API
export const uploadApi = {
  upload: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data),
};

// Tags API
export const tagsApi = {
  getAll: () => api.get('/api/tags').then(res => res.data),
};
