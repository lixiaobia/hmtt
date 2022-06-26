// 封装本地存储方式
// token里面的key已经是固定的了  这里的封装是替换除了token 以外的其他原生本地存储方式 方便统一管理和修改
export const setStorages = (key, value) => {
  localStorage.setItem(key, value)
}
export const getStorages = (key) => {
  return localStorage.getItem(key)
}
export const removeStorages = (key) => {
  localStorage.removeItem(key)
}
