import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextProps {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {

    const [theme, setTheme] = useState<Theme>(() => {
        //check save theme in localstorage
        const savedTheme = localStorage.getItem('theme') as Theme | null

        //system  preference
        if (!savedTheme) {
            const preferDark = window.matchMedia('(prefers-color-scheme:dark)').matches
            return preferDark ? 'dark' : 'light'
        }

        return savedTheme || 'light'
    })

    useEffect(() => {
        localStorage.setItem('theme', theme)
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}


export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be within a ThemeProvider')
    }
    return context
}