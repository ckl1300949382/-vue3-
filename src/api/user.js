import instance from '@/request'

export const userLogin = async ({ username, password }) => {
  return await instance.request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    },

  })
}

export const userRegister = async ({ username, password, email, name }) => {
  return await instance.request({
    url: '/api/register',
    method: 'post',
    data: {
      username,
      password,
      email,
      name
    }
  })
}

export const manageData = async (keyword, page = 1, pageSize = 10) => {
  return await instance.request({
    url: '/api/users',
    method: 'get',
    params: {
      keyword: keyword,
      page: page,
      pageSize: pageSize
    }
  })
}

export const deleteUser = async (id) => {
  return await instance.request({
    url: `/api/users/${id}`,
    method: 'delete'
  })
}

export const addUser = async ({ username, password, email, name }) => {
  return await instance.request({
    url: `/api/users`,
    method: 'post',
    data: { username, password, email, name }
  })
}

export const getUserById = async (id) => {
  return await instance.request({
    url: `/api/users/${id}`,
    method: 'get'
  })
}

export const updateUser = async (id, { name, email, role, status }) => {
  return await instance.request({
    url: `/api/users/${id}`,
    method: 'put',
    data: { name, email, role, status }
  })
}

export const changePassword = async (id, { oldPassword, newPassword }) => {
  return await instance.request({
    url: `/api/users/${id}/change-password`,
    method: 'post',
    data: { oldPassword, newPassword }
  })
}
