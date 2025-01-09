export function ThemeSwitcher() {
    const theme = localStorage.getItem('theme') || 'light';
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}
