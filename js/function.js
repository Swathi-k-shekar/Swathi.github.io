/**
 * Main JavaScript File
 * Handles animations, interactions, and dynamic content for the portfolio.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypewriter();
    initScrollAnimations();
    initCounters();
    initParticles();
});

/* ==========================================================================
   Navigation Logic
   ========================================================================== */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger to X (simplified)
            const spans = hamburger.querySelectorAll('span');
            hamburger.classList.toggle('is-active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Navbar shrink on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        }
    });
}

/* ==========================================================================
   Typewriter Effect for Hero Section
   ========================================================================== */
function initTypewriter() {
    const roles = [
        "QA Automation Engineer",
        "SDET",
        "Playwright Expert",
        "Java & JS Developer",
        "AI Automation Enthusiast"
    ];

    const typeWriterElement = document.getElementById('typewriter');
    if (!typeWriterElement) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typeWriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            typeWriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing new word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing
    setTimeout(type, 1000);
}

/* ==========================================================================
   Scroll Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    // Add fade-in class to major sections/elements
    const elementsToAnimate = document.querySelectorAll('.section-header, .glass-card, .timeline-item');

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

/* ==========================================================================
   Animated Counters
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is faster

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');

                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter); // Only animate once
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/* ==========================================================================
   Project Details Expand/Collapse Logic
   ========================================================================== */
function toggleDetails(projectId) {
    const detailsEl = document.getElementById(projectId);
    const btn = detailsEl.previousElementSibling.querySelector('.expand-btn') || detailsEl.parentElement.querySelector('.expand-btn');

    if (detailsEl.classList.contains('active')) {
        detailsEl.classList.remove('active');
        if(btn) btn.innerHTML = 'View Details &darr;';
    } else {
        // Optional: Close other open details
        // document.querySelectorAll('.project-details.active').forEach(el => {
        //     el.classList.remove('active');
        //     el.parentElement.querySelector('.expand-btn').innerHTML = 'View Details &darr;';
        // });

        detailsEl.classList.add('active');
        if(btn) btn.innerHTML = 'Hide Details &uarr;';
    }
}

// Make toggleDetails available globally for inline onclick handlers
window.toggleDetails = toggleDetails;

/* ==========================================================================
   QA Lab Modal Logic
   ========================================================================== */
const labFeatures = {
    'mock-interview': {
        title: 'AI Mock Interview',
        content: 'System: Initializing AI Interviewer...<br>System: Ready.<br><br>> Tell me about your experience with Playwright.'
    },
    'generate-script': {
        title: 'Playwright Script Generator',
        content: '// Generating script for: "Login and verify dashboard"<br><br>test("successful login", async ({ page }) => {<br>&nbsp;&nbsp;await page.goto("/login");<br>&nbsp;&nbsp;await page.fill("[name=user]", "testuser");<br>&nbsp;&nbsp;await page.fill("[name=pass]", "password123");<br>&nbsp;&nbsp;await page.click("button[type=submit]");<br>&nbsp;&nbsp;await expect(page.locator(".dashboard")).toBeVisible();<br>});'
    },
    'generate-testcases': {
        title: 'Test Case Generator',
        content: 'Analyzing user story: "As a user, I want to reset my password"<br><br>Generated Cases:<br>1. TC01: Valid email, receive reset link.<br>2. TC02: Invalid email, show error.<br>3. TC03: Expired token handling.<br>4. TC04: Password complexity validation.'
    },
    'summarize-bug': {
        title: 'Bug Report Summarizer',
        content: 'Analyzing 500 lines of console logs and network traces...<br><br>Summary: API endpoint /v1/users/profile is returning 500 Internal Server Error when the "avatar" field is null in the payload. Null pointer exception at ProfileService.java:142.'
    },
    'view-dashboard': {
        title: 'Automation Dashboard',
        content: 'Loading metrics...<br><br>Total Tests: 1,245<br>Passed: 1,230<br>Failed: 5<br>Flaky: 10<br>Coverage: 87%<br><br>[Visual Charts Placeholder]'
    }
};

function openLabModal(featureId) {
    const modal = document.getElementById('lab-modal');
    const titleEl = document.getElementById('modal-title');
    const demoArea = document.getElementById('modal-demo-area');

    if (labFeatures[featureId]) {
        titleEl.textContent = labFeatures[featureId].title;

        // Simulate thinking/loading
        demoArea.innerHTML = '<span style="color: var(--text-secondary)">Connecting to AI service...</span>';
        modal.style.display = 'flex';

        setTimeout(() => {
            demoArea.innerHTML = '';
            // Simple typing effect for the demo content
            let content = labFeatures[featureId].content;
            demoArea.innerHTML = content;
        }, 800);
    }
}

function closeLabModal() {
    document.getElementById('lab-modal').style.display = 'none';
}

// Make modal functions available globally
window.openLabModal = openLabModal;
window.closeLabModal = closeLabModal;

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('lab-modal');
    if (event.target == modal) {
        closeLabModal();
    }
}

/* ==========================================================================
   Background Particles
   ========================================================================== */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Random size between 2px and 6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random position
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;

    // Random animation duration and delay
    const duration = Math.random() * 10 + 10; // 10-20s
    const delay = Math.random() * 5;

    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
}
