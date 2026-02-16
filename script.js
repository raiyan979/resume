document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// Smooth reveal animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add hover effect to project cards based on mouse position
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Expandable logic
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.project-card');
        card.classList.toggle('expanded');

        const isExpanded = card.classList.contains('expanded');
        // Update text but keep the icon class consistent for the rotation animation to work if we want, 
        // OR just replace strictly.
        btn.innerHTML = isExpanded
            ? `Close Details <i data-lucide="chevron-up"></i>`
            : `Read More <i data-lucide="chevron-down"></i>`;

        lucide.createIcons();
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        const isOpened = navLinks.classList.contains('active');

        // Toggle icon between menu and x
        mobileMenuBtn.innerHTML = isOpened
            ? `<i data-lucide="x"></i>`
            : `<i data-lucide="menu"></i>`;

        lucide.createIcons();
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const iconBtn = mobileMenuBtn.querySelector('i');
        mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
        lucide.createIcons();
    });
});
// Email Copy to Clipboard Logic with Blank Tab Prevention
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Stop the blank tab from opening

        const email = "raiyan.mirza1233@gmail.com";
        const mailtoUrl = link.getAttribute('href');

        // Copy to clipboard
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(() => {
                showToast("Email copied to clipboard!");
                // After copying, try to open the email app after a short delay
                setTimeout(() => { window.location.href = mailtoUrl; }, 100);
            });
        } else {
            // Fallback for non-secure contexts (like local file testing)
            const textArea = document.createElement("textarea");
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast("Email copied to clipboard!");
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
            setTimeout(() => { window.location.href = mailtoUrl; }, 100);
        }
    });
});


function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
