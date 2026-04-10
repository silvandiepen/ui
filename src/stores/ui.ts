import { ref, computed } from 'vue';

// Simple UI store for theme management
const theme = ref<'light' | 'dark' | 'auto'>('auto');
const prefersDark = ref(false);

// Check for user's system preference
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDark.value = mediaQuery.matches;
  
  mediaQuery.addEventListener('change', (e) => {
    prefersDark.value = e.matches;
  });
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
    theme.value = savedTheme as 'light' | 'dark' | 'auto';
  }
}

export function useUIStore() {
  const actualTheme = computed(() => {
    if (theme.value === 'auto') {
      return prefersDark.value ? 'dark' : 'light';
    }
    return theme.value;
  });

  const toggleTheme = () => {
    if (theme.value === 'light') {
      theme.value = 'dark';
    } else if (theme.value === 'dark') {
      theme.value = 'auto';
    } else {
      theme.value = 'light';
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme.value);
    }
    
    // Update document class
    updateDocumentTheme();
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    theme.value = newTheme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    updateDocumentTheme();
  };

  const updateDocumentTheme = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(`theme-${actualTheme.value}`);
      root.setAttribute('data-theme', actualTheme.value);
    }
  };

  return {
    theme,
    actualTheme,
    toggleTheme,
    setTheme
  };
}