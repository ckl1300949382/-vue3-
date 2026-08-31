<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { addUser, updateUser } from '@/api/user'
import type { FormInstance } from 'element-plus'
import type { UserVO, RegisterDTO, UpdateUserDTO } from '@/types/user'

const props = defineProps<{ visible: boolean; user: UserVO | null }>()

const emit = defineEmits<{ (e: 'close'): void; (e: 'success'): void }>()

const formRef = ref<FormInstance>()
const formLabelAlign = ref<RegisterDTO & UpdateUserDTO>({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 1
})
const editId = ref<number | null>(null)
const isEditMode = computed(() => editId.value !== null)
const labelPosition = ref('right')

const rules = computed(() => (
    {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 20, message: '用户名长度 3-20 个字符', trigger: 'blur' }
        ],
        name: [
            { required: true, message: "请输入姓名", trigger: 'blur' }
        ],
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: isEditMode.value ? [] : [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '密码长度 6-20 个字符', trigger: 'blur' }
        ]
    }
))

watch(() => props.user, (val) => {
    if (val) {
        // 编辑模式:有 user → 填表,密码留空(不提交)
        editId.value = val.id
        formLabelAlign.value = {
            username: val.username, name: val.name, email: val.email,
            password: '', role: val.role, status: val.status
        }
    } else {
        // 新增模式:null → 清空回默认
        editId.value = null
        formLabelAlign.value = {
            username: '', name: '', email: '', password: '', role: 'user', status: 1
        }
    }
    nextTick(() => formRef.value?.clearValidate())
})

const handleSubmit = async () => {
    try {
        await formRef.value.validate()
    } catch {
        return
    }
    try {
        let res
        if (isEditMode.value) {
            // 编辑:只提交 UpdateUserDTO 的 4 个字段(用户名后端不允许改,与契约一致)
            res = await updateUser(editId.value, {
                name: formLabelAlign.value.name,
                email: formLabelAlign.value.email,
                role: formLabelAlign.value.role,
                status: formLabelAlign.value.status
            })
        } else {
            // 新增:提交 RegisterDTO 的 4 个字段(角色/状态由后端默认)
            res = await addUser({
                username: formLabelAlign.value.username,
                name: formLabelAlign.value.name,
                email: formLabelAlign.value.email,
                password: formLabelAlign.value.password
            })
        }
        if (res.code === 200) {
            ElMessage.success(isEditMode.value ? '更新成功' : '添加成功')
            emit('success')
        }
    } catch (err) {
        // 提交失败的具体原因（用户名重复、网络异常等）已由 request.ts 全局拦截器统一弹出提示
        ElMessage.error(isEditMode.value ? '更新失败，请重试' : '添加失败，请重试')
    }
}
</script>

<template>
    <el-dialog :model-value="props.visible" @close="emit('close')" :title="isEditMode ? '编辑用户' : '新增用户'" width="500px">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" ref="formRef" :rules="rules"
            @submit.prevent="handleSubmit">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formLabelAlign.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="formLabelAlign.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formLabelAlign.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="formLabelAlign.role">
                    <el-option label="管理员" value="admin" />
                    <el-option label="普通用户" value="user" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formLabelAlign.status">
                    <el-option label="正常" :value="1" />
                    <el-option label="禁用" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item size="large">
                <el-button type="primary" @click="handleSubmit">提交</el-button>
                <el-button @click="emit('close')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>