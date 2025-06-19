// Carousel Switch JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Carousel elements
    const carouselItems = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const bgLayers = document.querySelectorAll('.bg-layer');
    
    let currentSlide = 0;
    const totalSlides = carouselItems.length;
    let isTransitioning = false;
    
    // Auto-play settings
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 seconds
    
    // Initialize carousel
    function initCarousel() {
        updateCarousel();
        startAutoplay();
        setupEventListeners();
        setupKeyboardNavigation();
        setupTouchNavigation();
    }
    
    // Update carousel display
    function updateCarousel() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Update carousel items
        carouselItems.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            
            if (index === currentSlide) {
                item.classList.add('active');
                // Set background image
                const bgImage = item.getAttribute('data-bg');
                item.querySelector('.item-content').style.backgroundImage = `url(${bgImage})`;
            } else if (index === getPrevIndex()) {
                item.classList.add('prev');
            } else if (index === getNextIndex()) {
                item.classList.add('next');
            }
        });
        
        // Update background
        updateBackground();
        
        // Update indicators
        updateIndicators();
        
        // Add animation effects
        addSlideEffects();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }
    
    // Update background switcher
    function updateBackground() {
        bgLayers.forEach((layer, index) => {
            layer.classList.remove('active');
            if (index === currentSlide) {
                layer.classList.add('active');
            }
        });
    }
    
    // Update indicators
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentSlide) {
                indicator.classList.add('active');
            }
        });
    }
    
    // Add slide transition effects
    function addSlideEffects() {
        const activeItem = carouselItems[currentSlide];
        const overlay = activeItem.querySelector('.item-overlay');
        
        // Reset overlay animation
        overlay.style.transform = 'translateY(30px)';
        overlay.style.opacity = '0';
        
        // Animate overlay
        setTimeout(() => {
            overlay.style.transform = 'translateY(0)';
            overlay.style.opacity = '1';
        }, 200);
        
        // Add ripple effect to current indicator
        const activeIndicator = indicators[currentSlide];
        addRippleEffect(activeIndicator);
    }
    
    // Add ripple effect
    function addRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin-top: -10px;
            margin-left: -10px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Navigation functions
    function nextSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetAutoplay();
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoplay();
    }
    
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        currentSlide = index;
        updateCarousel();
        resetAutoplay();
    }
    
    // Helper functions
    function getPrevIndex() {
        return (currentSlide - 1 + totalSlides) % totalSlides;
    }
    
    function getNextIndex() {
        return (currentSlide + 1) % totalSlides;
    }
    
    // Autoplay functions
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Event listeners
    function setupEventListeners() {
        // Navigation buttons
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
        
        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);
        
        // Window resize handler
        window.addEventListener('resize', debounce(handleResize, 250));
    }
    
    // Keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'Escape':
                    stopAutoplay();
                    break;
            }
        });
    }
    
    // Touch navigation
    function setupTouchNavigation() {
        const carousel = document.querySelector('.carousel-wrapper');
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            // Only trigger if horizontal swipe is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        prevSlide();
                    } else {
                        nextSlide();
                    }
                }
            }
        }
    }
    
    // Window resize handler
    function handleResize() {
        // Recalculate carousel dimensions if needed
        updateCarousel();
    }
    
    // Utility function - debounce
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
    
    // Smooth scroll for navigation links
    function setupSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Gallery interactions
    function setupGalleryInteractions() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                // Add click effect
                this.style.transform = 'translateY(-10px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px) scale(1)';
                }, 150);
            });
            
            // Add hover sound effect (optional)
            item.addEventListener('mouseenter', function() {
                // You can add sound effects here if desired
            });
        });
    }
    
    // Feature cards animation on scroll
    function setupScrollAnimations() {
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
        
        const featureCards = document.querySelectorAll('.feature-card');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        [...featureCards, ...galleryItems].forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
    
    // Contact form handling
    function setupContactForm() {
        const form = document.querySelector('.contact-form form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Add form submission animation
                const button = this.querySelector('button[type="submit"]');
                const originalText = button.textContent;
                
                button.textContent = 'Sending...';
                button.style.background = 'rgba(255, 255, 255, 0.1)';
                
                // Simulate form submission
                setTimeout(() => {
                    button.textContent = 'Message Sent!';
                    button.style.background = 'rgba(76, 175, 80, 0.8)';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                        form.reset();
                    }, 2000);
                }, 1000);
            });
        }
    }
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .carousel-item {
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-card, .gallery-item {
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize everything
    initCarousel();
    setupSmoothScroll();
    setupGalleryInteractions();
    setupScrollAnimations();
    setupContactForm();
    
    console.log('Carousel Switch initialized successfully');
});

// Performance optimization - Intersection Observer for lazy loading
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLazyLoading);
} else {
    setupLazyLoading();
}
