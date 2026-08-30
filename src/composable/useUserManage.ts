import { manageData, deleteUser } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted } from 'vue'
import { usePage } from '@/composable/usePage'
import { useDebounce } from '@/composable/useDebounce'
import { useUserStore } from '@/store/useLoginUserStore'
import type { UserVO } from '@/types/user'

export function useUserManage() {
    const { currentPage, pageSize, total, onPageChange, resetPage } = usePage()
    const keyword = ref('')
    const loading = ref(false)
    const manageDataList = ref<UserVO[]>([])
    const dialogVisible = ref(false)




    //分页查询用户列表
    const getManageData = async () => {
        loading.value = true
        try {
            const res = await manageData({ keyword: keyword.value, page: currentPage.value, pageSize: pageSize.value })
            manageDataList.value = res.data.list
            total.value = res.data.total
        } catch (err) {
            console.error('获取用户列表失败', err);
            ElMessage.error('获取用户列表失败，请稍后重试')
        } finally {
            loading.value = false
        }
    }




    //搜索
    const doSearch = () => {
        // 弹窗打开时按 Enter 不应触发列表搜索（弹窗内的 Enter 用于提交表单）
        if (dialogVisible.value) return
        resetPage()
        getManageData()
    }
    const handleSearch = useDebounce(doSearch)
    const handleCurrentChange = (e: number) => {
        onPageChange(e)
        getManageData()
    }



    //删除用户
    const handleDelete = async (id: number) => {
        const store = useUserStore()
        if (store.userInfo?.id === id) {
            ElMessage.error('不能删除自己')
            return
        }
        try {
            await ElMessageBox.confirm('确认删除，该用户？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            const res = await deleteUser(id)
            if (res.code === 200) {
                ElMessage.success('删除成功')
                getManageData()
            } else {
                ElMessage.error(res.message || '删除失败')
            }
        } catch (err) {
            if (err === 'cancel' || err === 'close') {
                return
            }
            // 其他删除失败原因已由全局拦截器统一弹出提示
        }
    }
    onMounted(() => {
        getManageData()
    })
    return {
        manageDataList, keyword, loading,
        currentPage, pageSize, total,
        dialogVisible,
        handleSearch, handleCurrentChange, handleDelete,
        getManageData
    }
}
