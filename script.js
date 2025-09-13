// Custom JavaScript for SafeScroll.AI Bootstrap Website

document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply fade-in animation to cards and sections
    const animatedElements = document.querySelectorAll('.card, .icon-box, .step-number');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const counter = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(start) + (element.dataset.suffix || '');
            }
        }, 16);
    }
    
    // Animate counters when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-counter]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.counter);
                    animateCounter(counter, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    // Add counter data attributes to stats
    const statsElements = document.querySelectorAll('.hero-section h3');
    statsElements.forEach((el, index) => {
        const values = ['98', '24', '10'];
        if (values[index]) {
            el.dataset.counter = values[index];
            el.textContent = '0';
            statsObserver.observe(el.closest('.col-4'));
        }
    });
    
    // Add counter for solution section stats
    const solutionStats = document.querySelectorAll('.card-body h6');
    solutionStats.forEach((el, index) => {
        const values = ['2847', '12', '24'];
        if (values[index] && el.textContent.match(/^\d+$/)) {
            el.dataset.counter = values[index];
            el.textContent = '0';
            statsObserver.observe(el.closest('.card'));
        }
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image-container');
        if (heroImage) {
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Add loading states for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            const originalText = this.innerHTML;
            const loadingText = this.innerHTML.replace(/Get Early Access|Chat on WhatsApp/, match => {
                return match.includes('WhatsApp') ? 
                    '<i class="bi bi-hourglass-split me-2"></i>Opening WhatsApp...' :
                    '<i class="bi bi-hourglass-split me-2"></i>Opening Form...';
            });
            
            this.innerHTML = loadingText;
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Form validation for any future forms (placeholder)
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        });
        
        return isValid;
    }
    
    // Initialize tooltips if any
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers if any
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Add click tracking for analytics (placeholder)
    function trackClick(element, action) {
        // This is where you would add your analytics tracking code
        console.log('Click tracked:', {
            element: element.tagName,
            action: action,
            text: element.textContent.trim(),
            timestamp: new Date().toISOString()
        });
    }
    
    // Track important button clicks
    document.querySelectorAll('.btn-gradient, .btn-success').forEach(btn => {
        btn.addEventListener('click', function() {
            trackClick(this, 'cta_click');
        });
    });
    
    // Track section views
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.id || entry.target.className;
                console.log('Section viewed:', sectionName);
                // trackSectionView(sectionName);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Preload critical images
    function preloadImages() {
        const criticalImages = [
            'src/assets/hero-family.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    preloadImages();
    
});

// Utility functions
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

// Debounced scroll handler for performance
const handleScroll = debounce(() => {
    // Additional scroll-based animations can be added here
}, 16);

window.addEventListener('scroll', handleScroll);