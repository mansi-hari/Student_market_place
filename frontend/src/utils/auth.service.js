// import api from './api';

// export const signup = async (userData) => {
//   const response = await api.post('/auth/signup', userData);
//   return response.data;
// };

// export const login = async (credentials) => {
//   const response = await api.post('/auth/login', credentials);
  
//   // Save token to localStorage
//   if (response.data.data.token) {
//     localStorage.setItem('token', response.data.data.token);
//     localStorage.setItem('user', JSON.stringify(response.data.data.user));
//   }
  
//   return response.data;
// };

// export const logout = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
// };

// export const getCurrentUser = async () => {
//   const response = await api.get('/auth/me');
//   return response.data;
// };

// export const updateProfile = async (userData) => {
//   const response = await api.put('/auth/me', userData);
  
//   // Update stored user data
//   localStorage.setItem('user', JSON.stringify(response.data.data));
  
//   return response.data;
// };

// export const changePassword = async (passwordData) => {
//   const response = await api.put('/auth/change-password', passwordData);
//   return response.data;
// };