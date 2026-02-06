document.addEventListener('DOMContentLoaded', () => {
    const hudBoxes = document.querySelectorAll('.hud-box, .about-box');
    
    hudBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.style.transform = 'scale(1.02)';
            box.style.boxShadow = '0 0 30px rgba(255, 0, 34, 0.3)';
            box.style.zIndex = '10';
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'scale(1)';
            box.style.boxShadow = 'inset 0 0 20px rgba(255, 0, 34, 0.1)';
            box.style.zIndex = '1';
        });
    });

    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.transition = 'width 1.5s ease-out';
            progressBar.style.width = '85%';
        }, 500);
    }

    const nameElement = document.querySelector('.name-box .value');
    if (nameElement) {
        const text = nameElement.textContent.trim().replace(/ /g, '\u00A0');
        nameElement.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                nameElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    const mainContent = document.querySelector('main');  
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    const links = document.querySelectorAll('nav a, .btn-talk');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
                        if (href === '#monkey') {
                e.preventDefault();
                openMonkeyModal();
                return;
            }

            if (href.startsWith('#')) return;

            e.preventDefault();
            
            if (mainContent) {
                mainContent.classList.remove('fade-in');
                mainContent.classList.add('fade-out');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 500); 
            } else {
                window.location.href = href;
            }
        });
    });

    function createMonkeyModal() {
        if (document.querySelector('.monkey-modal')) return;

        const modal = document.createElement('div');
        modal.className = 'monkey-modal';
        modal.innerHTML = `
            <div class="monkey-content">
                <button class="close-monkey"><i class="fas fa-times"></i></button>
                <img src="https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=500&h=500&fit=crop" alt="Monkey" class="monkey-img">
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-monkey');
        closeBtn.addEventListener('click', closeMonkeyModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeMonkeyModal();
        });
    }

    function openMonkeyModal() {
        createMonkeyModal();
        setTimeout(() => {
            document.querySelector('.monkey-modal').classList.add('show');
        }, 10);
    }

    function closeMonkeyModal() {
        const modal = document.querySelector('.monkey-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    const menuBtn = document.querySelector('.menu-btn');
    const sideDrawer = document.querySelector('.side-drawer');
    const backdrop = document.querySelector('.backdrop');
    const closeBtn = document.querySelector('.close-btn');
    const drawerLinks = document.querySelectorAll('.drawer-nav a');

    function openDrawer() {
        if (sideDrawer) sideDrawer.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
    }

    function closeDrawer() {
        if (sideDrawer) sideDrawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', openDrawer);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeDrawer);
    }

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });
});
