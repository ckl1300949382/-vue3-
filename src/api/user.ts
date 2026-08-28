import instance from '@/request'
import type { UserVO, RegisterDTO, LoginDTO, UpdateUserDTO, LoginVO, ChangePasswordDTO, UserQueryDTO } from '@/types/user'
import type { BizResult, PageData } from '@/types/api'

export const userLogin = async ({ username, password }: LoginDTO): Promise<BizResult<LoginVO>> => {
  return await instance.request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    },

  })
}

export const userRegister = async ({ username, password, email, name }: RegisterDTO): Promise<BizResult<UserVO>> => {
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

export const manageData = async (query: UserQueryDTO): Promise<BizResult<PageData<UserVO>>> => {
  return await instance.request({
    url: '/api/users',
    method: 'get',
    params: query
  })
}

export const deleteUser = async (id: number): Promise<BizResult<null>> => {
  return await instance.request({
    url: `/api/users/${id}`,
    method: 'delete'
  })
}

export const addUser = async ({ username, password, email, name }: RegisterDTO): Promise<BizResult<UserVO>> => {
  return await instance.request({
    url: `/api/users`,
    method: 'post',
    data: { username, password, email, name }
  })
}

export const getUserById = async (id: number): Promise<BizResult<UserVO>> => {
  return await instance.request({
    url: `/api/users/${id}`,
    method: 'get'
  })
}

export const updateUser = async (id: number, { name, email, role, status }: UpdateUserDTO): Promise<BizResult<UserVO>> => {
  return await instance.request({
    url: `/api/users/${id}`,
    method: 'put',
    data: { name, email, role, status }
  })
}

export const changePassword = async (id: number, { oldPassword, newPassword }: ChangePasswordDTO): Promise<BizResult<null>> => {
  return await instance.request({
    url: `/api/users/${id}/change-password`,
    method: 'post',
    data: { oldPassword, newPassword }
  })
}

export const getStats = async (): Promise<BizResult<{ total: number; active: number; admin: number; year: number }>> => {
  return await instance.request({
    url: '/api/stats',
    method: 'get'
  })
}
