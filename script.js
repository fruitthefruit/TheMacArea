document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('arc-items');
    const items = document.querySelectorAll('.arc-item');
    const labels = document.querySelectorAll('.label-text');
    
    let currentRotation = 0;
    let circleTypes = [];

    // --- Initialization ---
    function init() {
        // Initialize CircleType for each label
        labels.forEach(label => {
            const ct = new CircleType(label);
            circleTypes.push(ct);
        });
        updateRadius();
        updateActiveItem();
    }

    // --- Dynamic Radius ---
    function updateRadius() {
        // World radius is 60vh. Convert to pixels.
        const radius = window.innerHeight * 0.6;
        circleTypes.forEach(ct => {
            ct.radius(radius);
        });
    }

    window.addEventListener('resize', updateRadius);

    // --- Interaction State ---
    let isDragging = false;
    let startX = 0;
    let startRotation = 0;
    let dragThreshold = 5; // pixels
    let hasMoved = false;

    // --- Mouse Events ---
    window.addEventListener('mousedown', (e) => {
        // Ignore clicks on header (top 20% of screen)
        if (e.clientY < window.innerHeight * 0.2) return;
        onDragStart(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        onDragMove(e.clientX);
    });

    window.addEventListener('mouseup', onDragEnd);

    // --- Touch Events ---
    window.addEventListener('touchstart', (e) => {
        if (e.touches[0].clientY < window.innerHeight * 0.2) return;
        onDragStart(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
        onDragMove(e.touches[0].clientX);
    });

    window.addEventListener('touchend', onDragEnd);

    // --- Drag Logic ---
    function onDragStart(x) {
        isDragging = true;
        hasMoved = false;
        startX = x;
        startRotation = currentRotation;
        
        // Disable transition for instant response
        container.style.transition = 'none';
        document.body.style.cursor = 'grabbing';
    }

    function onDragMove(x) {
        if (!isDragging) return;

        const deltaX = x - startX;
        
        // Check threshold to avoid treating micro-movements as drags
        if (Math.abs(deltaX) > dragThreshold) {
            hasMoved = true;
        }

        if (hasMoved) {
            // Sensitivity: 1px = 0.25deg
            const newRotation = startRotation + (deltaX * 0.25);
            currentRotation = newRotation;
            container.style.transform = `rotate(${currentRotation}deg)`;
        }
    }

    function onDragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        document.body.style.cursor = 'default';

        // Restore transition
        container.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

        if (hasMoved) {
            snapToNearest();
        }
    }

    // --- Click Handling ---
    items.forEach(item => {
        const clickable = item.querySelector('.character-container');
        if (clickable) {
            clickable.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // If we just finished a drag, don't treat as click
                if (hasMoved) return;

                const angleStr = item.style.getPropertyValue('--angle');
                const angle = parseFloat(angleStr.replace('deg', ''));
                rotateTo(-angle);
            });
        }
    });

    // --- Rotation Logic ---
    function rotateTo(deg) {
        currentRotation = deg;
        // Ensure transition is on
        container.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        container.style.transform = `rotate(${currentRotation}deg)`;
        updateActiveItem();
    }

    function snapToNearest() {
        // Snap to nearest 360/7 degrees (approx 51.43)
        const step = 360 / 7;
        const snapAngle = Math.round(currentRotation / step) * step;
        rotateTo(snapAngle);
    }

    function updateActiveItem() {
        let closestItem = null;
        let minDiff = Infinity;

        items.forEach(item => {
            const angleStr = item.style.getPropertyValue('--angle');
            const baseAngle = parseFloat(angleStr.replace('deg', ''));
            
            // Normalize angle relative to current rotation
            let totalAngle = (baseAngle + currentRotation) % 360;
            if (totalAngle > 180) totalAngle -= 360;
            if (totalAngle < -180) totalAngle += 360;

            if (Math.abs(totalAngle) < minDiff) {
                minDiff = Math.abs(totalAngle);
                closestItem = item;
            }
        });

        items.forEach(i => i.classList.remove('active'));
        if (closestItem) {
            closestItem.classList.add('active');
        }
    }

    // Start
    // Wait for fonts to load before initializing CircleType to ensure correct spacing
    if (document.fonts) {
        document.fonts.ready.then(() => {
            init();
        });
    } else {
        // Fallback for browsers that don't support document.fonts
        window.addEventListener('load', init);
    }

    // --- Profile Dropdown ---
    const profileTrigger = document.getElementById('profile-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileTrigger.classList.toggle('active');
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileTrigger.classList.remove('active');
                profileDropdown.classList.remove('show');
            }
        });
    }

    const topMascots = document.querySelector('.top-mascots');
    if (topMascots) {
        const floats = topMascots.querySelectorAll('.mascot-float');
        const counterEl = topMascots.querySelector('.counter');
        if (floats.length === 2 && counterEl) {
            let total = 12;
            const parseCurrent = () => {
                const t = counterEl.textContent.trim();
                const parts = t.split('/');
                const n = parseInt(parts[0], 10);
                const tot = parseInt(parts[1], 10);
                if (!isNaN(tot)) total = tot;
                return isNaN(n) ? 1 : n;
            };
            const clampAndRender = (n) => {
                if (n < 1) n = 1;
                if (n > total) n = total;
                counterEl.textContent = `${n}/${total}`;
                return n;
            };
            let current = parseCurrent();
            floats[0].addEventListener('click', () => {
                current = clampAndRender(current - 1);
            });
            floats[1].addEventListener('click', () => {
                current = clampAndRender(current + 1);
            });
        }
    }

    const menuIcon = document.querySelector('.menu-icon');
    const drawer = document.getElementById('left-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (menuIcon && drawer && overlay) {
        const toggleDrawer = (open) => {
            if (open) {
                drawer.classList.add('open');
                overlay.classList.add('show');
            } else {
                drawer.classList.remove('open');
                overlay.classList.remove('show');
            }
        };
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = drawer.classList.contains('open');
            toggleDrawer(!isOpen);
        });
        overlay.addEventListener('click', () => toggleDrawer(false));
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleDrawer(false);
        });
        drawer.querySelectorAll('.drawer-item').forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                const match = Array.from(items).find(i => i.getAttribute('data-label') === target);
                if (match) {
                    const angleStr = match.style.getPropertyValue('--angle');
                    const angle = parseFloat(angleStr.replace('deg', ''));
                    rotateTo(-angle);
                }
                toggleDrawer(false);
            });
        });
    }
});
