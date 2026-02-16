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
// Final Boss: Email Handle with zero-tab policy
document.querySelectorAll('.email-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.getAttribute('data-email') || "raiyan.mirza1233@gmail.com";

        // 1. Copy to clipboard immediately
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(() => {
                showToast("Email copied to clipboard!");
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast("Email copied to clipboard!");
        }

        // 2. Trigger Mail app using an invisible iframe (the most compatible way to avoid tabs)
        const mailtoUrl = `mailto:${email}`;
        const tempIframe = document.createElement('iframe');
        tempIframe.style.display = 'none';
        tempIframe.src = mailtoUrl;
        document.body.appendChild(tempIframe);

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(tempIframe);
        }, 500);
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
