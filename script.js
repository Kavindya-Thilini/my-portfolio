document.addEventListener('DOMContentLoaded', () => {

    // ========== THEME TOGGLE ==========
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleIcon(newTheme);
        });
    }

    function updateToggleIcon(theme) {
        if (!themeToggleBtn) return;
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    // ========== MOBILE NAVIGATION ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                hamburger.textContent = '✕';
                hamburger.setAttribute('aria-label', 'Close menu');
            } else {
                hamburger.textContent = '☰';
                hamburger.setAttribute('aria-label', 'Menu');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.textContent = '☰';
                hamburger.setAttribute('aria-label', 'Menu');
            });
        });
    }

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========== CONTACT FORM (AJAX to Netlify) ==========
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const formData = new FormData(form);
            formData.append('form-name', 'contact');

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData).toString(),
                });

                if (response.ok) {
                    formMessage.style.display = 'block';
                    formMessage.style.color = 'var(--violet-deep)';
                    formMessage.textContent = 'Thank you! Your message has been sent. ✨';
                    form.reset();
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                formMessage.style.display = 'block';
                formMessage.style.color = '#cc4b37';
                formMessage.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message ✨';
            }
        });
    }

    // ========== DYNAMIC PROJECTS ==========
    loadProjects();
});

async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        const response = await fetch('/projects.json');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projects = await response.json();

        projects.sort((a, b) => (a.order || 0) - (b.order || 0));

        container.innerHTML = '';

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'project-img';
            if (project.image) {
                imgDiv.innerHTML = `<img src="${project.image}" alt="${project.title}" style="width:100%; height:100%; object-fit:cover;">`;
            } else {
                imgDiv.textContent = project.title;
            }

            const infoDiv = document.createElement('div');
            infoDiv.className = 'project-info';
            infoDiv.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description || ''}</p>
                <div class="tech-tags">
                    ${(project.tech || []).map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.live_url ? `<a href="${project.live_url}" target="_blank">Live Demo ↗</a>` : ''}
                    ${project.code_url ? `<a href="${project.code_url}" target="_blank">Code ↗</a>` : ''}
                </div>
            `;

            card.appendChild(imgDiv);
            card.appendChild(infoDiv);
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<p style="color: var(--text-medium);">Could not load projects right now.</p>';
        console.error('Error loading projects:', error);
    }
}