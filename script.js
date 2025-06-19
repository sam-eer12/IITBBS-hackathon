// Loading Screen JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading screen script started');
    
    // Initialize theme for loading screen
    initializeLoadingTheme();
    const loadingBarFill = document.querySelector('.loading-bar-fill');
    const percentageDisplay = document.getElementById('loading-percentage');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const mainContent = document.querySelector('.main-content');
    const splitBars = document.querySelector('.split-bars');
    const mainLoadingBar = document.querySelector('.main-loading-bar');
      console.log('Elements found:', {
        loadingBarFill: !!loadingBarFill,
        percentageDisplay: !!percentageDisplay,
        loadingOverlay: !!loadingOverlay,
        mainContent: !!mainContent,
        splitBars: !!splitBars,
        mainLoadingBar: !!mainLoadingBar
    });
    
    // Check if essential elements exist
    if (!loadingBarFill || !percentageDisplay || !loadingOverlay) {
        console.error('Essential loading elements missing, redirecting to homepage');
        window.location.href = 'unified-homepage.html';
        return;
    }
    
    let progress = 0;
    const loadingDuration = 3000; // 3 seconds
    const updateInterval = 30; // Update every 30ms for smooth animation
    const incrementAmount = (100 / (loadingDuration / updateInterval));
    
    // Start loading progress
    const loadingInterval = setInterval(() => {
        progress += incrementAmount;
        
        // Smooth progress increment
        const displayProgress = Math.min(progress, 100);
        
        percentageDisplay.textContent = Math.floor(displayProgress) + '%';
        loadingBarFill.style.width = displayProgress + '%';
        
        // Complete loading when progress reaches 100%
        if (progress >= 100) {
            clearInterval(loadingInterval);
            percentageDisplay.textContent = '100%';
            loadingBarFill.style.width = '100%';
            
            // Start the breaking animation after a brief pause
            setTimeout(() => {
                startBreakingAnimation();
            }, 300);
        }
    }, updateInterval);    // Function to start the breaking and expansion animation
    function startBreakingAnimation() {
        // Hide the main loading bar
        mainLoadingBar.style.display = 'none';
        
        // Show split bars
        splitBars.style.display = 'block';
        
        // Add the completion animation class
        splitBars.classList.add('loading-complete');
        
        // Create reveal effect with clip-path during L formation
        setTimeout(() => {
            // Start revealing homepage content with L-shaped mask
            const steps = 20;
            let currentStep = 0;
            
            const revealInterval = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                
                // Create L-shaped reveal mask
                const leftWidth = Math.min(50 * progress, 50);
                const bottomHeight = Math.min(50 * progress, 50);
                
                // Apply clip-path to create L-shaped reveal
                loadingOverlay.style.clipPath = `inset(0 ${100 - leftWidth}% ${100 - bottomHeight}% 0)`;
                  if (currentStep >= steps) {
                    clearInterval(revealInterval);
                    
                    // Complete reveal
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                        // Redirect to full homepage
                        setTimeout(() => {
                            window.location.href = 'unified-homepage.html';
                        }, 500);
                    }, 300);
                }
            }, 50);
        }, 1000); // Start reveal during L formation
    }    // Skip loading functionality
    function skipLoading() {
        clearInterval(loadingInterval);
        progress = 100;
        percentageDisplay.textContent = '100%';
        loadingBarFill.style.width = '100%';
        
        // Immediate redirect when skipping
        setTimeout(() => {
            window.location.href = 'unified-homepage.html';
        }, 300);
    }
    
    // Keyboard interaction - Press SPACE to skip
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !loadingOverlay.classList.contains('loading-hidden')) {
            e.preventDefault();
            skipLoading();
        }
    });
    
    // Click interaction - Click anywhere to skip
    loadingOverlay.addEventListener('click', () => {
        if (!loadingOverlay.classList.contains('loading-hidden')) {
            skipLoading();
        }
    });
    
    // Touch interaction for mobile - Tap to skip
    loadingOverlay.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!loadingOverlay.classList.contains('loading-hidden')) {
            skipLoading();
        }
    });
    
    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';
    
    console.log('Loading screen initialized');
    console.log('Click anywhere, press SPACE, or tap to skip loading');
});

// Initialize theme for loading screen
function initializeLoadingTheme() {
    const savedTheme = localStorage.getItem('techflow_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}
