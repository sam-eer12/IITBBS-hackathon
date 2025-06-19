class UnifiedHomepage {
    constructor() {
        this.initializeComponents();
        this.initializeRippleEffect();
        this.initializeNavigation();
        this.initializeParallax();
        this.initializeCarousel();
        this.initializeCustomerSection();
        this.initializeScrollEffects();
        this.initializeLoadingReset(); // Add reset functionality
    }

    initializeComponents() {
        // Initialize all component references
        this.navbar = document.querySelector('.navbar');
        this.rippleContainer = document.querySelector('.water-ripple-container');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        
        // Ripple effect variables
        this.lastMousePosition = { x: 0, y: 0 };
        this.velocityHistory = [];
        this.isMoving = false;
        this.moveTimeout = null;
        
        // Parallax variables
        this.parallaxElements = document.querySelectorAll('[data-speed]');
        
        // Carousel variables
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-item');
        this.indicators = document.querySelectorAll('.indicator');
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        
        // Customer section variables
        this.customerGrid = document.getElementById('customerGrid');
        this.customerModal = document.getElementById('customerModal');
        this.countdown = document.getElementById('countdown');
        this.refreshProgress = document.querySelector('.refresh-progress');
        this.currentCustomers = [];
        this.refreshInterval = null;
        this.countdownInterval = null;
        this.timeLeft = 5;
        
        this.customers = this.generateCustomerData();
    }

    initializeNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Mobile menu toggle
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    initializeParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            this.parallaxElements.forEach(element => {
                const speed = element.dataset.speed;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });

        // Mouse parallax effect for floating elements
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            document.querySelectorAll('.floating-shape').forEach((shape, index) => {
                const speed = (index + 1) * 0.02;
                const x = (mouseX - 0.5) * 20 * speed;
                const y = (mouseY - 0.5) * 20 * speed;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    initializeCarousel() {
        if (!this.slides.length) return;

        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicator buttons
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-slide functionality
        this.startAutoSlide();

        // Pause auto-slide on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.stopAutoSlide());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoSlide());
        }

        // Touch/swipe support
        this.initializeCarouselTouch();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else if (index === (this.currentSlide - 1 + this.totalSlides) % this.totalSlides) {
                slide.classList.add('prev');
            } else if (index === (this.currentSlide + 1) % this.totalSlides) {
                slide.classList.add('next');
            }
        });

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    initializeCarouselTouch() {
        const carousel = document.querySelector('.carousel-track');
        if (!carousel) return;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoSlide();
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.startAutoSlide();
        });
    }

    initializeCustomerSection() {
        if (!this.customerGrid) return;

        this.createCustomerGrid();
        this.populateCustomerGrid();
        this.startCustomerRefreshCycle();
    }

    generateCustomerData() {
        const firstNames = ['Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Chris', 'Anna', 'Mark', 'Sophie', 'James', 'Maria', 'John', 'Isabella', 'Robert', 'Emily', 'Daniel', 'Olivia', 'Ryan', 'Grace'];
        const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];
        const companies = ['TechCorp', 'InnovateLab', 'FutureSoft', 'DataFlow', 'CloudWorks', 'SmartSys', 'NetCore', 'DevHub', 'CodeCraft', 'ByteTech', 'PixelPro', 'WebWave', 'AppForge', 'SysGen', 'InfoTech', 'DigiMax', 'ProCode', 'TechFlow', 'DataLink', 'CyberNet'];
        const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Media', 'Gaming', 'E-commerce'];
        const titles = ['CEO', 'CTO', 'Lead Developer', 'Product Manager', 'Designer', 'Data Scientist', 'Marketing Director', 'Sales Manager', 'Engineer', 'Analyst'];
        
        const customers = [];
        
        for (let i = 0; i < 100; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const company = companies[Math.floor(Math.random() * companies.length)];
            const industry = industries[Math.floor(Math.random() * industries.length)];
            const title = titles[Math.floor(Math.random() * titles.length)];
            
            customers.push({
                id: i + 1,
                name: `${firstName} ${lastName}`,
                company: company,
                industry: industry,
                title: title,
                since: 2018 + Math.floor(Math.random() * 6),
                rating: 3 + Math.random() * 2,
                description: `${firstName} has been instrumental in driving innovation at ${company}. Their expertise in ${industry.toLowerCase()} has helped transform their business processes and achieve remarkable growth.`
            });
        }
        
        return customers;
    }

    createCustomerGrid() {
        // Create 2x10 grid (20 items)
        for (let i = 0; i < 20; i++) {
            const gridItem = document.createElement('div');
            gridItem.className = 'customer-card';
            gridItem.addEventListener('mouseenter', (e) => this.showCustomerInfo(e));
            gridItem.addEventListener('mouseleave', () => this.hideCustomerInfo());
            this.customerGrid.appendChild(gridItem);
        }
    }

    populateCustomerGrid() {
        const gridItems = this.customerGrid.querySelectorAll('.customer-card');
        const shuffledCustomers = [...this.customers].sort(() => Math.random() - 0.5);
        this.currentCustomers = shuffledCustomers.slice(0, 20);
        
        gridItems.forEach((item, index) => {
            const customer = this.currentCustomers[index];
            item.innerHTML = `
                <div class="card-content">
                    <div class="customer-avatar">
                        <img src="https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=80&h=80&fit=crop&crop=face&auto=format" alt="${customer.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjEgMTIgMTYgMTAuMjEgMTYgOEMxNiA1Ljc5IDE0LjIxIDQgMTIgNEM5Ljc5IDQgOCA1Ljc5IDggOEM4IDEwLjIxIDkuNzkgMTIgMTIgMTJaTTEyIDE0QzkuMzMgMTQgNCAyNS4zMyA0IDIyVjIwSDIwVjIyQzIwIDI1LjMzIDE0LjY3IDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo='">
                    </div>
                    <div class="customer-info">
                        <h4 class="customer-name">${customer.name}</h4>
                        <p class="customer-company">${customer.company}</p>
                    </div>
                </div>
            `;
            item.dataset.customerId = customer.id;
            
            // Add animation class
            item.classList.add('fade-in');
            setTimeout(() => item.classList.remove('fade-in'), 300);
        });
    }

    showCustomerInfo(event) {
        if (!this.customerModal) return;
        
        const customerId = parseInt(event.currentTarget.dataset.customerId);
        const customer = this.currentCustomers.find(c => c.id === customerId);
        
        if (!customer) return;
        
        // Populate modal
        const modalAvatar = document.getElementById('modalAvatar');
        const modalName = document.getElementById('modalName');
        const modalTitle = document.getElementById('modalTitle');
        const modalCompany = document.getElementById('modalCompany');
        const modalIndustry = document.getElementById('modalIndustry');
        const modalSince = document.getElementById('modalSince');
        const modalDescription = document.getElementById('modalDescription');
        const modalRating = document.getElementById('modalRating');
        
        if (modalAvatar) modalAvatar.src = event.currentTarget.querySelector('.customer-avatar img').src;
        if (modalName) modalName.textContent = customer.name;
        if (modalTitle) modalTitle.textContent = customer.title;
        if (modalCompany) modalCompany.textContent = customer.company;
        if (modalIndustry) modalIndustry.textContent = customer.industry;
        if (modalSince) modalSince.textContent = customer.since;
        if (modalDescription) modalDescription.textContent = customer.description;
        
        // Generate rating stars
        if (modalRating) {
            const rating = Math.round(customer.rating);
            modalRating.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('span');
                star.textContent = i < rating ? '★' : '☆';
                star.className = i < rating ? 'star filled' : 'star';
                modalRating.appendChild(star);
            }
        }
        
        // Position and show modal
        const rect = event.currentTarget.getBoundingClientRect();
        this.customerModal.style.left = `${rect.right + 20}px`;
        this.customerModal.style.top = `${rect.top}px`;
        this.customerModal.classList.add('show');
    }

    hideCustomerInfo() {
        if (this.customerModal) {
            this.customerModal.classList.remove('show');
        }
    }

    startCustomerRefreshCycle() {
        if (!this.countdown || !this.refreshProgress) return;
        
        this.refreshInterval = setInterval(() => {
            this.populateCustomerGrid();
            this.timeLeft = 5;
        }, 5000);
        
        this.countdownInterval = setInterval(() => {
            this.timeLeft--;
            this.countdown.textContent = this.timeLeft;
            
            // Update progress bar
            const progress = ((5 - this.timeLeft) / 5) * 100;
            this.refreshProgress.style.setProperty('--progress', `${progress}%`);
            
            if (this.timeLeft <= 0) {
                this.timeLeft = 5;
            }
        }, 1000);
    }

    initializeRippleEffect() {
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        document.addEventListener('click', (e) => {
            this.createClickRipple(e.clientX, e.clientY);
        });

        this.startTrailAnimation();
    }

    handleMouseMove(event) {
        const { clientX, clientY } = event;
        
        // Calculate velocity
        const currentTime = Date.now();
        const velocity = {
            x: clientX - this.lastMousePosition.x,
            y: clientY - this.lastMousePosition.y,
            time: currentTime
        };
        
        this.velocityHistory.push(velocity);
        if (this.velocityHistory.length > 5) {
            this.velocityHistory.shift();
        }
        
        this.lastMousePosition = { x: clientX, y: clientY };
        
        // Create movement ripple if moving fast enough
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed > 2) {
            this.createDirectionalMovementRipple(clientX, clientY, velocity);
        }
        
        this.isMoving = true;
        clearTimeout(this.moveTimeout);
        this.moveTimeout = setTimeout(() => {
            this.isMoving = false;
            this.velocityHistory = [];
        }, 100);
    }

    createDirectionalMovementRipple(x, y, velocity) {
        const ripple = document.createElement('div');
        ripple.classList.add('water-ripple', 'directional');
        
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const size = Math.min(8 + speed * 0.8, 20);
        
        const angle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);
        const momentumX = velocity.x * 1.5;
        const momentumY = velocity.y * 1.5;
        
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (x - size/2) + 'px';
        ripple.style.top = (y - size/2) + 'px';
        ripple.style.setProperty('--ripple-angle', angle + 'deg');
        ripple.style.setProperty('--momentum-x', momentumX + 'px');
        ripple.style.setProperty('--momentum-y', momentumY + 'px');
        
        const opacity = Math.min(0.3 + speed * 0.02, 0.7);
        ripple.style.background = `linear-gradient(${angle}deg, 
            rgba(102, 126, 234, ${opacity}) 0%, 
            rgba(118, 75, 162, ${opacity * 0.7}) 30%, 
            rgba(255, 255, 255, ${opacity * 0.3}) 60%, 
            transparent 100%)`;
        
        this.rippleContainer.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 400);
    }

    createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.classList.add('water-ripple');
        
        const size = 30 + Math.random() * 20;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (x - size/2) + 'px';
        ripple.style.top = (y - size/2) + 'px';
        
        this.rippleContainer.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 500);
    }

    startTrailAnimation() {
        setInterval(() => {
            if (!this.isMoving) {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const randomVelocity = {
                    x: (Math.random() - 0.5) * 4,
                    y: (Math.random() - 0.5) * 4
                };
                this.createDirectionalMovementRipple(x, y, randomVelocity);
            }
        }, 3000);
    }

    initializeScrollEffects() {
        // Add intersection observer for scroll animations
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

        // Observe elements for scroll animations
        document.querySelectorAll('.floating-card, .feature-item, .contact-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    initializeLoadingReset() {
        // Add functionality to reset loading screen experience
        const resetButton = document.getElementById('resetLoadingBtn');
        if (resetButton) {
            resetButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Clear the localStorage flag
                localStorage.removeItem('techflow_loading_completed');
                // Redirect to index.html to show loading screen again
                window.location.href = 'index.html';
            });
        }
    }

    // Public methods for external interaction
    goToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    refreshCustomers() {
        if (this.customerGrid) {
            this.populateCustomerGrid();
        }
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    setAutoSlideInterval(ms) {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, ms);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.unifiedHomepage = new UnifiedHomepage();
});

// Add some utility functions
window.addEventListener('resize', () => {
    // Handle responsive adjustments
    if (window.innerWidth <= 768) {
        // Mobile adjustments
        const customerModal = document.getElementById('customerModal');
        if (customerModal && customerModal.classList.contains('show')) {
            customerModal.style.left = '50%';
            customerModal.style.top = '50%';
            customerModal.style.transform = 'translate(-50%, -50%)';
        }
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedHomepage;
}
