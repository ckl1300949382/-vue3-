import { ref } from 'vue'

interface PageOption {
    defaultPage?: number,
    defaultSize?: number
}

export function usePage({ defaultPage = 1, defaultSize = 10 }: PageOption = {}) {
    const currentPage = ref(defaultPage)
    const pageSize = ref(defaultSize)
    const total = ref(0)

    function onPageChange(page: number) {
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