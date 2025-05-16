// Theme management
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    // Add smooth transitions for theme changes
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    document.querySelectorAll('*').forEach(element => {
        element.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let searchIndex = [];

    // Load search index
    fetch('/js/search-index.json')
        .then(response => response.json())
        .then(data => {
            searchIndex = data.pages;
        });

    searchInput?.addEventListener('input', debounce(handleSearch, 300));

    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        const results = searchIndex.filter(page => 
            page.title.toLowerCase().includes(query) || 
            page.content.toLowerCase().includes(query)
        );

        displaySearchResults(results);
    }

    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }

        const html = results.map(result => `
            <a href="${result.url}" class="search-result">
                <h3>${result.title}</h3>
                <p>${result.content}</p>
            </a>
        `).join('');

        searchResults.innerHTML = html;
    }

    // Interactive examples
    document.querySelectorAll('.interactive-demo').forEach(demo => {
        const editor = demo.querySelector('.code-editor');
        const preview = demo.querySelector('.preview');
        const runButton = demo.querySelector('.run-button');

        if (editor && preview && runButton) {
            runButton.addEventListener('click', () => {
                try {
                    preview.innerHTML = editor.value;
                } catch (error) {
                    preview.innerHTML = `<p class="error">Error: ${error.message}</p>`;
                }
            });
        }
    });

    // Code copy functionality
    document.querySelectorAll('pre code').forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        
        block.parentNode.style.position = 'relative';
        block.parentNode.appendChild(copyButton);

        copyButton.addEventListener('click', async () => {
            await navigator.clipboard.writeText(block.textContent);
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });
    });
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scrolling to navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add active state to navigation links
const updateActiveLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            const id = section.id;
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// Practice exercises
document.querySelectorAll('.exercise').forEach(exercise => {
    const header = exercise.querySelector('.exercise-header');
    const content = exercise.querySelector('.exercise-content');
    if (!header || !content) return;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show Solution';
    toggleButton.className = 'exercise-toggle';
    header.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        const isActive = exercise.classList.toggle('active');
        toggleButton.textContent = isActive ? 'Hide Solution' : 'Show Solution';
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    // Alt + Arrow Left/Right for navigation
    if (e.altKey) {
        const nav = document.querySelector('.page-navigation');
        if (!nav) return;

        if (e.key === 'ArrowLeft') {
            const prevLink = nav.querySelector('a:first-child');
            if (prevLink) prevLink.click();
        } else if (e.key === 'ArrowRight') {
            const nextLink = nav.querySelector('a:last-child');
            if (nextLink) nextLink.click();
        }
    }
});