import { ref, watch, onMounted } from 'vue'

// Global reactive state (shared across components)
const isDark = ref(true)

export const useTheme = () => {
    const initTheme = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme')
            if (saved) {
                isDark.value = saved === 'dark'
            }
            applyTheme()
        }
    }

    const applyTheme = () => {
        if (typeof document !== 'undefined') {
            if (isDark.value) {
                document.documentElement.classList.add('dark')
                document.documentElement.classList.remove('light')
            } else {
                document.documentElement.classList.add('light')
                document.documentElement.classList.remove('dark')
            }
        }
    }

    const toggleTheme = () => {
        isDark.value = !isDark.value
        applyTheme()
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        }
    }

    return {
        isDark,
        initTheme,
        toggleTheme
    }
}
