// Simple Portfolio JavaScript - Compatible with shuffle.js
document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio JS loaded');

    // Wait for shuffle.js to initialize first
    setTimeout(function () {
        // Get portfolio elements after shuffle.js has processed them
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const portfolioFilters = document.querySelectorAll('.portfolio-filters a');

        console.log('Found portfolio items:', portfolioItems.length);
        console.log('Found filters:', portfolioFilters.length);

        // Force show all portfolio items immediately
        portfolioItems.forEach((item, index) => {
            console.log(`Setting up item ${index + 1}:`, item.querySelector('.portfolio-title')?.textContent);

            // Force visibility
            item.style.display = 'block';
            item.style.visibility = 'visible';
            item.style.opacity = '1';
            item.style.position = 'relative';
            item.style.float = 'none';
            item.style.width = '100%';
            item.style.margin = '0';
            item.style.padding = '0';

            // Remove any animation delays
            item.style.animationDelay = '0s';
            item.style.transition = 'all 0.3s ease';
        });

        // Check grid container
        const gridContainer = document.querySelector('.portfolio-grid.modern-grid');
        if (gridContainer) {
            console.log('Grid container found:', gridContainer);
            gridContainer.style.display = 'grid';
            gridContainer.style.visibility = 'visible';

            // Add a test element to verify grid is working
            setTimeout(() => {
                console.log('Grid computed style:', window.getComputedStyle(gridContainer).display);
                console.log('Items in grid:', gridContainer.children.length);
            }, 100);
        } else {
            console.error('Grid container not found!');
        }

        // Hover effects
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-8px)';
            });

            item.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
            });
        });

        console.log('Portfolio setup complete');
    }, 1000); // Wait 1 second for shuffle.js to initialize
});
