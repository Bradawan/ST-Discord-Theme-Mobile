/**
 * Mobile Enhancement Module for SillyTavern Discord Theme
 * Provides touch-friendly interactions and mobile-specific optimizations
 */

export class MobileEnhancements {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isScrolling = false;
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 767;
    }

    initialize() {
        if (this.isMobile) {
            this.addMobileMetaTag();
            this.enhanceTouchInteractions();
            this.optimizeScrolling();
            this.handleOrientationChange();
            this.improveTouchTargets();
            this.addSwipeGestures();
        }
    }

    addMobileMetaTag() {
        // Ensure proper viewport meta tag for mobile
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    enhanceTouchInteractions() {
        // Add touch feedback for interactive elements
        const interactiveElements = document.querySelectorAll('.interactable, button, .menu_button, .drawer-icon');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        });
    }

    handleTouchStart(event) {
        const element = event.currentTarget;
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
    }

    handleTouchEnd(event) {
        const element = event.currentTarget;
        setTimeout(() => {
            element.style.transform = '';
            element.style.transition = '';
        }, 100);
    }

    optimizeScrolling() {
        // Improve scrolling performance on mobile
        const scrollableElements = document.querySelectorAll('.scrollableInner, #chat, .drawer-content');
        
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
            element.style.overflowScrolling = 'touch';
        });
    }

    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustLayoutForOrientation();
            }, 100);
        });
    }

    adjustLayoutForOrientation() {
        const isLandscape = window.innerHeight < window.innerWidth;
        document.body.classList.toggle('mobile-landscape', isLandscape);
        
        // Trigger a resize event to help other components adjust
        window.dispatchEvent(new Event('resize'));
    }

    improveTouchTargets() {
        // Ensure minimum touch target size
        const smallElements = document.querySelectorAll('button, .fa-fw, .interactable');
        
        smallElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                element.style.minWidth = '44px';
                element.style.minHeight = '44px';
                element.style.display = 'inline-flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
            }
        });
    }

    addSwipeGestures() {
        // Add swipe gestures for drawer navigation
        const drawers = document.querySelectorAll('.drawer-content');
        
        drawers.forEach(drawer => {
            drawer.addEventListener('touchstart', this.handleSwipeStart.bind(this), { passive: true });
            drawer.addEventListener('touchmove', this.handleSwipeMove.bind(this), { passive: true });
            drawer.addEventListener('touchend', this.handleSwipeEnd.bind(this), { passive: true });
        });
    }

    handleSwipeStart(event) {
        this.touchStartY = event.touches[0].clientY;
        this.isScrolling = false;
    }

    handleSwipeMove(event) {
        if (!this.isScrolling) {
            const touchY = event.touches[0].clientY;
            const deltaY = Math.abs(touchY - this.touchStartY);
            
            if (deltaY > 10) {
                this.isScrolling = true;
            }
        }
    }

    handleSwipeEnd(event) {
        if (!this.isScrolling) {
            this.touchEndY = event.changedTouches[0].clientY;
            const swipeDistance = this.touchStartY - this.touchEndY;
            
            // Handle swipe gestures (can be extended for specific drawer behaviors)
            if (Math.abs(swipeDistance) > 50) {
                // Swipe detected - can add specific behaviors here
                console.log('Swipe detected:', swipeDistance > 0 ? 'up' : 'down');
            }
        }
        
        this.isScrolling = false;
    }

    // Method to be called when drawers are opened/closed
    onDrawerToggle(drawer, isOpen) {
        if (this.isMobile && isOpen) {
            // Prevent body scrolling when drawer is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Method to handle keyboard appearance on mobile
    handleVirtualKeyboard() {
        const textInputs = document.querySelectorAll('input[type="text"], textarea');
        
        textInputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Scroll input into view when keyboard appears
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }

    // Utility method to check if device is in landscape mode
    isLandscape() {
        return window.innerHeight < window.innerWidth;
    }

    // Utility method to get safe area insets for devices with notches
    getSafeAreaInsets() {
        const style = getComputedStyle(document.documentElement);
        return {
            top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
            right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
            bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
            left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
        };
    }
}

