// Enhanced Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function () {

    // Ensure portfolio items are visible immediately
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.visibility = 'visible';
        item.style.transform = 'none';
    });

    // Debug: Log portfolio items count
    console.log('Portfolio items found:', portfolioItems.length);
    portfolioItems.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, item.querySelector('.portfolio-title')?.textContent);
    });

    // Force show all items initially
    setTimeout(() => {
        portfolioItems.forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.visibility = 'visible';
            item.style.position = 'relative';
            item.style.transform = 'none';
        });
        console.log('Portfolio items force-shown');
    }, 100);

    // Portfolio filter functionality enhancement
    const portfolioFilters = document.querySelectorAll('.portfolio-filters a');

    // Enhanced filter functionality
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all filters
            portfolioFilters.forEach(f => f.parentElement.classList.remove('active'));

            // Add active class to clicked filter
            this.parentElement.classList.add('active');

            // Get filter category
            const filterValue = this.getAttribute('data-group');

            // Filter portfolio items with smooth animation
            portfolioItems.forEach((item, index) => {
                const itemCategories = JSON.parse(item.getAttribute('data-groups') || '["category_all"]');

                if (filterValue === 'category_all' || itemCategories.includes(filterValue)) {
                    // Show item with delay for stagger effect
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(30px)';

                        // Trigger animation
                        requestAnimationFrame(() => {
                            item.style.transition = 'all 0.6s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        });
                    }, index * 100);
                } else {
                    // Hide item
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';

                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Update URL hash for better UX
            const category = filterValue.replace('category_', '');
            history.replaceState(null, null, '#portfolio-' + category);
        });
    });

    // Portfolio item hover effects
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const image = item.querySelector('.portfolio-item-img img');

        item.addEventListener('mouseenter', function () {
            // Add parallax effect to image
            if (image) {
                image.style.transform = 'scale(1.1) rotate(1deg)';
            }
        });

        item.addEventListener('mouseleave', function () {
            // Reset image transform
            if (image) {
                image.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe portfolio items
        portfolioItems.forEach(item => {
            portfolioObserver.observe(item);
        });

        // Observe portfolio filters
        const filtersWrapper = document.querySelector('.portfolio-filters-wrapper');
        if (filtersWrapper) {
            portfolioObserver.observe(filtersWrapper);
        }
    }

    // Touch swipe support for mobile filters
    let touchStartX = 0;
    let touchEndX = 0;

    const filtersContainer = document.querySelector('.portfolio-filters');
    if (filtersContainer) {
        filtersContainer.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        filtersContainer.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        });

        function handleSwipeGesture() {
            const swipeThreshold = 50;
            const currentActive = document.querySelector('.portfolio-filters li.active');
            const filters = Array.from(document.querySelectorAll('.portfolio-filters li'));
            const currentIndex = filters.indexOf(currentActive);

            if (touchEndX < touchStartX - swipeThreshold && currentIndex < filters.length - 1) {
                // Swipe left - next filter
                filters[currentIndex + 1].querySelector('a').click();
            }

            if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
                // Swipe right - previous filter
                filters[currentIndex - 1].querySelector('a').click();
            }
        }
    }

    // Lazy loading for portfolio images
    const portfolioImages = document.querySelectorAll('.portfolio-item-img img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        portfolioImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }

    // Enhanced keyboard navigation
    portfolioFilters.forEach((filter, index) => {
        filter.addEventListener('keydown', function (e) {
            let targetIndex = index;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    targetIndex = (index + 1) % portfolioFilters.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    targetIndex = (index - 1 + portfolioFilters.length) % portfolioFilters.length;
                    break;
                case 'Home':
                    e.preventDefault();
                    targetIndex = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    targetIndex = portfolioFilters.length - 1;
                    break;
                default:
                    return;
            }

            portfolioFilters[targetIndex].focus();
        });
    });

    // Portfolio stats counter (optional feature)
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.innerHTML = current;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Check for URL hash on page load to auto-filter
    if (window.location.hash) {
        const hash = window.location.hash.replace('#portfolio-', '');
        const targetFilter = document.querySelector(`[data-group="category_${hash}"]`);
        if (targetFilter) {
            setTimeout(() => {
                targetFilter.click();
            }, 500);
        }
    }

    // Add loading state management
    function showPortfolioLoading() {
        const grid = document.querySelector('.portfolio-grid');
        if (grid) {
            grid.innerHTML = '<div class="portfolio-loading">Carregando projetos...</div>';
        }
    }

    function hidePortfolioLoading() {
        const loading = document.querySelector('.portfolio-loading');
        if (loading) {
            loading.remove();
        }
    }

    // Performance optimization: debounce resize events
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

    // Handle window resize for responsive adjustments
    const handleResize = debounce(() => {
        // Recalculate grid layout if needed
        const grid = document.querySelector('.portfolio-grid.modern-grid');
        if (grid) {
            // Trigger reflow for better responsive behavior
            grid.style.display = 'none';
            grid.offsetHeight; // Trigger reflow
            grid.style.display = 'grid';
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    // Add smooth scroll to portfolio section when clicking menu
    const portfolioNavLink = document.querySelector('a[href="#portfolio"]');
    if (portfolioNavLink) {
        portfolioNavLink.addEventListener('click', function (e) {
            e.preventDefault();
            const portfolioSection = document.querySelector('#portfolio');
            if (portfolioSection) {
                portfolioSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// CSS animation classes for enhanced effects
const portfolioAnimationCSS = `
.animate-in {
    animation: slideInUp 0.8s ease forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.portfolio-item-img img.loaded {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.portfolio-item-img img:not(.loaded) {
    opacity: 0;
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = portfolioAnimationCSS;
document.head.appendChild(style);
