import { ref } from 'vue'

export function usePage({ defaultPage = 1, defaultSize = 10 } = {}) {
    const currentPage = ref(defaultPage)
    const pageSize = ref(defaultSize)
    const total = ref(0)

    function onPageChange(page) {
        currentPage.value = page
    }

    function resetPage() {
        currentPage.value = 1
    }
    return {
        currentPage,
        pageSize,
        total,
        onPageChange,
        resetPage
    }
}