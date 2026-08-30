<script setup lang="ts">
import type { UserVO } from '@/types/user'

defineProps<{
    list: UserVO[]
    total: number
    currentPage: number
    pageSize: number
    loading: boolean
}>()
const emit = defineEmits<{
    (e: 'edit', user: UserVO): void
    (e: 'delete', id: number): void
    (e: 'page-change', page: number): void
}>()
</script>

<template>
    <!-- 用户表格 -->
    <el-table :data="list" border stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" align="center" />
        <el-table-column prop="username" label="用户名" width="100" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="email" label="邮箱" min-width="180" />

        <!-- 角色列：用 el-tag 显示 -->
        <el-table-column prop="role" label="角色" width="100" align="center">
            <template #default="{ row }">
                <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" effect="plain">
                    {{ row.role === 'admin' ? '管理员' : '普通用户' }}
                </el-tag>
            </template>
        </el-table-column>

        <!-- 状态列：用 el-tag 显示 -->
        <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="plain" size="small">
                    {{ row.status === 1 ? '正常' : '禁用' }}
                </el-tag>
            </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="注册时间" width="180" />

        <!-- 操作列 -->
        <el-table-column label="操作" width="160" align="center">
            <template #default="{ row }">
                <el-button size="small" type="primary" plain @click="emit('edit', row)">编辑</el-button>
                <el-button size="small" type="danger" plain @click="emit('delete', row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
        :page-size="pageSize" @current-change="(e: number) => emit('page-change', e)"></el-pagination>
</template>
