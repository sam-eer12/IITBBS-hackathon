// Parallax Animation Script
document.addEventListener('DOMContentLoaded', function() {
    
    // Parallax effect for background images
    function parallaxScroll() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Parallax for floating cards and feature cards
        const parallaxCards = document.querySelectorAll('[data-parallax]');
        parallaxCards.forEach(card => {
            const speed = card.getAttribute('data-parallax') || 0.1;
            const rect = card.getBoundingClientRect();
            const elementTop = rect.top + scrolled;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            // Calculate if element is in viewport
            if (elementTop < scrolled + windowHeight && elementTop + elementHeight > scrolled) {
                const yPos = (scrolled - elementTop) * speed;
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
    
    // Smooth parallax using requestAnimationFrame
    let ticking = false;
    function updateParallax() {
        parallaxScroll();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Video call interface interactions
    const mainVideo = document.querySelector('.main-video');
    const smallVideos = document.querySelectorAll('.small-video');
    
    // Add hover effects for video elements
    if (mainVideo) {
        mainVideo.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02)';
        });
        
        mainVideo.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
        });
    }
    
    smallVideos.forEach(video => {
        video.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(500px) rotateY(0deg) scale(1.05)';
        });
        
        video.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(500px) rotateY(15deg)';
        });
    });
    
    // Floating elements animation
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add floating animation with different delays
        card.style.animationDelay = `${index * 0.5}s`;
        
        // Add random gentle movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            card.style.transform += ` translate(${randomX}px, ${randomY}px)`;
            
            setTimeout(() => {
                card.style.transform = card.style.transform.replace(/ translate\([^)]*\)/g, '');
            }, 2000);
        }, 3000 + index * 1000);
    });
    
    // Intersection Observer for animations on scroll
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
    
    // Observe feature cards for scroll animations
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = stat.textContent;
            const isPercent = target.includes('%');
            const isPlus = target.includes('+');
            const numericValue = parseInt(target.replace(/[^\d]/g, ''));
            
            let current = 0;
            const increment = numericValue / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                if (target.includes('M')) {
                    displayValue = (current / 1000000).toFixed(1) + 'M';
                } else if (target.includes('K')) {
                    displayValue = (current / 1000).toFixed(1) + 'K';
                }
                
                if (isPercent) displayValue += '%';
                if (isPlus) displayValue += '+';
                
                stat.textContent = displayValue;
            }, 50);
        });
    }
    
    // Trigger stats animation when stats section is visible
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        
        statsObserver.observe(statsSection);
    }
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Mouse movement parallax for hero section
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;
            
            const videoInterface = document.querySelector('.video-call-interface');
            if (videoInterface) {
                videoInterface.style.transform = `translate(${xPercent * 10}px, ${yPercent * 5}px)`;
            }
            
            const heroText = document.querySelector('.hero-text');
            if (heroText) {
                heroText.style.transform = `translate(${xPercent * -5}px, ${yPercent * -3}px)`;
            }
        });
    }
    
    // Add loading animation
    window.addEventListener('load', function() {
        const elements = document.querySelectorAll('.main-video, .hero-text, .secondary-videos');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
    
    console.log('Parallax animation initialized');
});
