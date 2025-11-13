class LuxuryAccordion {
    constructor() {
        this.accordionItems = document.querySelectorAll('.accordion-item');
        this.overlay = document.getElementById('luxuryOverlay');
        this.closeOverlayBtn = document.getElementById('closeOverlay');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showOverlay();
    }

    bindEvents() {
        // Accordion functionality
        this.accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => this.toggleAccordion(item));
        });

        // Overlay functionality
        this.closeOverlayBtn.addEventListener('click', () => this.hideOverlay());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hideOverlay();
            }
        });

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.hideOverlay();
            }
        });

        // Smooth scroll behavior for better UX
        this.accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                setTimeout(() => {
                    if (item.classList.contains('active')) {
                        this.scrollToItem(item);
                    }
                }, 300);
            });
        });
    }

    toggleAccordion(clickedItem) {
        const isCurrentlyActive = clickedItem.classList.contains('active');
        
        // Close all accordion items with smooth animation
        this.accordionItems.forEach(item => {
            if (item !== clickedItem && item.classList.contains('active')) {
                this.closeAccordionItem(item);
            }
        });

        // Toggle the clicked item
        if (isCurrentlyActive) {
            this.closeAccordionItem(clickedItem);
        } else {
            this.openAccordionItem(clickedItem);
        }
    }

    openAccordionItem(item) {
        const content = item.querySelector('.accordion-content');
        const contentInner = item.querySelector('.content-inner');
        
        // Add active class immediately to prevent the rectangle bug
        item.classList.add('active');
        
        // Set initial height to auto temporarily to measure content
        content.style.maxHeight = 'none';
        const scrollHeight = content.scrollHeight;
        content.style.maxHeight = '0';
        
        // Force reflow
        content.offsetHeight;
        
        // Animate to the measured height
        requestAnimationFrame(() => {
            content.style.maxHeight = scrollHeight + 'px';
            
            // Ensure content is visible immediately
            setTimeout(() => {
                contentInner.style.opacity = '1';
                contentInner.style.transform = 'translateY(0)';
            }, 100);
        });

        // Set to auto after animation completes for responsiveness
        setTimeout(() => {
            if (item.classList.contains('active')) {
                content.style.maxHeight = 'none';
            }
        }, 600);

        // Add enhanced visual effects
        this.addActiveEffects(item);
    }

    closeAccordionItem(item) {
        const content = item.querySelector('.accordion-content');
        const contentInner = item.querySelector('.content-inner');
        
        // Hide content immediately
        contentInner.style.opacity = '0';
        contentInner.style.transform = 'translateY(20px)';
        
        // Set current height then animate to 0
        content.style.maxHeight = content.scrollHeight + 'px';
        
        requestAnimationFrame(() => {
            content.style.maxHeight = '0';
        });

        // Remove active class after animation
        setTimeout(() => {
            item.classList.remove('active');
        }, 600);

        // Remove enhanced visual effects
        this.removeActiveEffects(item);
    }

    addActiveEffects(item) {
        const header = item.querySelector('.accordion-header');
        const iconWrapper = item.querySelector('.icon-wrapper');
        
        // Add subtle glow effect
        header.style.boxShadow = 'inset 0 0 20px rgba(212, 175, 55, 0.1)';
        iconWrapper.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.3)';
        
        // Animate icon
        iconWrapper.style.transform = 'scale(1.1) rotate(10deg)';
    }

    removeActiveEffects(item) {
        const header = item.querySelector('.accordion-header');
        const iconWrapper = item.querySelector('.icon-wrapper');
        
        // Remove effects
        header.style.boxShadow = '';
        iconWrapper.style.boxShadow = '';
        iconWrapper.style.transform = '';
    }

    scrollToItem(item) {
        const headerOffset = 100;
        const elementPosition = item.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    showOverlay() {
        setTimeout(() => {
            this.overlay.classList.add('active');
        }, 1000);
    }

    hideOverlay() {
        this.overlay.classList.remove('active');
    }

    // Enhanced methods for better user experience
    preloadContent() {
        // Preload images and content for smoother animations
        this.accordionItems.forEach(item => {
            const content = item.querySelector('.accordion-content');
            const tempHeight = content.style.maxHeight;
            content.style.maxHeight = 'none';
            content.style.visibility = 'hidden';
            content.style.position = 'absolute';
            
            setTimeout(() => {
                content.style.maxHeight = tempHeight;
                content.style.visibility = '';
                content.style.position = '';
            }, 100);
        });
    }

    addRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Add ripple effect CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced initialization with error handling and performance optimization
document.addEventListener('DOMContentLoaded', () => {
    try {
        const accordion = new LuxuryAccordion();
        
        // Preload content for better performance
        setTimeout(() => {
            accordion.preloadContent();
        }, 500);
        
        // Add sophisticated interactions
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', (e) => {
                accordion.addRippleEffect(header, e);
            });
        });

        // Performance monitoring
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'measure') {
                        console.log(`${entry.name}: ${entry.duration}ms`);
                    }
                }
            });
            observer.observe({ entryTypes: ['measure'] });
        }

    } catch (error) {
        console.error('Luxury Accordion initialization failed:', error);
        
        // Fallback for basic accordion functionality
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion-item');
                item.classList.toggle('active');
            });
        });
    }
});

// Enhanced smooth scrolling for the entire page
if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Add luxury loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Stagger animation for accordion items
    const items = document.querySelectorAll('.accordion-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${0.1 + index * 0.1}s`;
    });
});

// Add focus management for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});
