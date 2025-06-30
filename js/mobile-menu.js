document.addEventListener('DOMContentLoaded', function() {
    // Select the mobile menu button more precisely
    const mobileMenuButton = document.querySelector('button#mobile-menu-button');
    if (!mobileMenuButton) {
        console.error('Mobile menu button not found');
        return;
    }

    // Create a larger click area for the button
    mobileMenuButton.style.padding = '10px';
    mobileMenuButton.style.margin = '-10px'; // Offset padding to keep visual position
    mobileMenuButton.style.cursor = 'pointer';

    // Create mobile menu container if it doesn't exist
    let mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu fixed top-[70px] left-0 w-full bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out lg:hidden z-50';
        document.body.appendChild(mobileMenu);
    }

    // Clone navigation items
    const mainNav = document.querySelector('nav.hidden.lg\\:flex');
    if (mainNav && mobileMenu.children.length === 0) {
        const menuItems = mainNav.cloneNode(true);
        menuItems.className = 'flex flex-col space-y-4 p-6';
        mobileMenu.appendChild(menuItems);

        // Set up dropdowns for mobile
        setupMobileDropdowns(mobileMenu);
    }

    let isMenuOpen = false;

    // Use multiple event handlers to ensure click is captured
    ['click', 'touchstart'].forEach(eventType => {
        mobileMenuButton.addEventListener(eventType, function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        }, { passive: false });
    });

    // Function to toggle menu state
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenu.style.transform = isMenuOpen ? 'translateX(0)' : 'translateX(100%)';
        
        // Get the SVG element directly
        const icon = mobileMenuButton.querySelector('svg');
        if (icon) {
            if (isMenuOpen) {
                // X icon for close
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
            } else {
                // Hamburger icon for open
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            }
        }

        // Add/remove a class to the button for additional styling if needed
        if (isMenuOpen) {
            mobileMenuButton.classList.add('menu-open');
        } else {
            mobileMenuButton.classList.remove('menu-open');
        }
    }

    // Set up dropdowns for mobile
    function setupMobileDropdowns(menuContainer) {
        const dropdowns = menuContainer.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (menu) {
                menu.className = 'dropdown-menu bg-gray-50 mt-2 py-2 px-4 rounded-md';
                menu.style.display = 'none'; // Hide by default
            }
            
            if (trigger && menu) {
                // Make the dropdown trigger more clickable
                trigger.style.padding = '8px 0';
                trigger.style.display = 'block';
                
                // Handle dropdown toggle
                ['click', 'touchstart'].forEach(eventType => {
                    trigger.addEventListener(eventType, function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Toggle dropdown visibility
                        if (menu.style.display === 'none' || !menu.classList.contains('active')) {
                            menu.style.display = 'block';
                            menu.classList.add('active');
                        } else {
                            menu.style.display = 'none';
                            menu.classList.remove('active');
                        }
                    }, { passive: false });
                });
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            isMenuOpen = false;
            mobileMenu.style.transform = 'translateX(100%)';
            
            const icon = mobileMenuButton.querySelector('svg');
            if (icon) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            }
            
            mobileMenuButton.classList.remove('menu-open');
        }
    });

    // Add overlay to indicate menu can be closed by tapping elsewhere
    if (!document.querySelector('.mobile-menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay fixed inset-0 bg-black opacity-0 pointer-events-none transition-opacity duration-300 lg:hidden';
        document.body.appendChild(overlay);
        
        // Show/hide overlay with menu
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        if (menuOverlay) {
            // Update overlay when menu toggles
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'style' && mutation.attributeName === 'style') {
                        if (mobileMenu.style.transform.includes('translateX(0)')) {
                            menuOverlay.style.opacity = '0.5';
                            menuOverlay.style.pointerEvents = 'auto';
                        } else {
                            menuOverlay.style.opacity = '0';
                            menuOverlay.style.pointerEvents = 'none';
                        }
                    }
                });
            });
            
            observer.observe(mobileMenu, { attributes: true, attributeFilter: ['style'] });
            
            // Close menu when overlay is clicked
            menuOverlay.addEventListener('click', function() {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    mobileMenu.style.transform = 'translateX(100%)';
                    
                    const icon = mobileMenuButton.querySelector('svg');
                    if (icon) {
                        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
                    }
                    
                    mobileMenuButton.classList.remove('menu-open');
                }
            });
        }
    }
});