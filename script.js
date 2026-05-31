document.addEventListener('DOMContentLoaded', () => {
    // ----- THEME TOGGLE -----
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme or use light as default
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
        // Use emoji or text icon; you can change these
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    // ----- SMOOTH SCROLLING -----
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

    // ----- CONTACT FORM (AJAX to Netlify) -----
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
});