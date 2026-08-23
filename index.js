/* JavaScript for Maxwell B. Antwi Portfolio */

document.addEventListener('DOMContentLoaded', () => {

    // 0. Single-Pass Hero Typewriter Effect (Types once and stays permanently)
    const typingTextElem = document.getElementById('hero-typing-text');
    if (typingTextElem) {
        const fullText = "Digital Forensics & Incident Response (DFIR) Specialist";
        let charIdx = 0;

        function typeEffect() {
            if (charIdx < fullText.length) {
                typingTextElem.textContent += fullText.charAt(charIdx);
                charIdx++;
                setTimeout(typeEffect, 50);
            }
        }

        typeEffect();
    }

    // 0.1 Real-Time Interactive Cursor Bubble Trail on Hero Section
    const heroCanvas = document.getElementById('hero-bubble-canvas');
    const heroSection = document.getElementById('home');

    if (heroCanvas && heroSection) {
        const ctx = heroCanvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            const rect = heroSection.getBoundingClientRect();
            heroCanvas.width = rect.width;
            heroCanvas.height = rect.height;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class BubbleParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 7 + 3; // Bubble radius
                this.speedX = (Math.random() - 0.5) * 1.6;
                this.speedY = (Math.random() - 0.5) * 1.6 - 0.4;
                this.color = Math.random() > 0.3 ? 'rgba(102, 252, 241, ' : 'rgba(69, 162, 158, ';
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.015;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.size += 0.12;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#66fcf1';
                ctx.fill();

                // Specular light highlight on bubble surface
                ctx.beginPath();
                ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.6})`;
                ctx.fill();
                ctx.restore();
            }
        }

        function spawnBubbles(e) {
            const rect = heroSection.getBoundingClientRect();
            const currentX = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
            const currentY = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

            for (let i = 0; i < 2; i++) {
                particles.push(new BubbleParticle(currentX, currentY));
            }
        }

        heroSection.addEventListener('mousemove', spawnBubbles);
        heroSection.addEventListener('touchmove', spawnBubbles);

        function animateBubbles() {
            ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].alpha <= 0 || particles[i].size > 35) {
                    particles.splice(i, 1);
                    i--;
                }
            }

            requestAnimationFrame(animateBubbles);
        }

        animateBubbles();
    }

    // 1. Projects Modal Open/Close Controls
    const openModalBtn = document.getElementById('open-projects-modal');
    const closeModalBtn = document.getElementById('close-projects-modal');
    const projectsModal = document.getElementById('projects-modal');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modalProjectsGrid = document.querySelector('.modal-projects-grid');
    const modalTopBar = document.getElementById('modal-top-bar');
    const toggleHeaderBtn = document.getElementById('toggle-modal-header');

    let isManuallyFolded = false;

    function updateHeaderFoldState() {
        if (!modalTopBar) return;
        
        const isScrolled = modalProjectsGrid && modalProjectsGrid.scrollTop > 30;
        
        if (isManuallyFolded || isScrolled) {
            modalTopBar.classList.add('folded');
            if (toggleHeaderBtn) {
                const foldText = toggleHeaderBtn.querySelector('.fold-text');
                if (foldText) foldText.textContent = 'Expand';
            }
        } else {
            modalTopBar.classList.remove('folded');
            if (toggleHeaderBtn) {
                const foldText = toggleHeaderBtn.querySelector('.fold-text');
                if (foldText) foldText.textContent = 'Fold Top';
            }
        }
    }

    if (modalProjectsGrid) {
        modalProjectsGrid.addEventListener('scroll', updateHeaderFoldState);
    }

    if (toggleHeaderBtn) {
        toggleHeaderBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isManuallyFolded = !isManuallyFolded;
            updateHeaderFoldState();
        });
    }

    function openModal() {
        if (projectsModal) {
            projectsModal.classList.add('active');
            projectsModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            isManuallyFolded = false;
            if (modalProjectsGrid) modalProjectsGrid.scrollTop = 0;
            updateHeaderFoldState();
        }
    }

    function closeModal() {
        if (projectsModal) {
            projectsModal.classList.remove('active');
            projectsModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        }
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectsModal && projectsModal.classList.contains('active')) {
            closeModal();
        }
    });

    // 2. Category Filtering Inside Modal (Supports Desktop Buttons & Mobile Form Select)
    const filterButtons = document.querySelectorAll('.modal-filters .filter-btn');
    const modalProjectCards = document.querySelectorAll('.modal-project');
    const mobileCategorySelect = document.getElementById('mobile-category-select');

    function applyCategoryFilter(selectedFilter) {
        // Sync active state on buttons
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === selectedFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Sync dropdown value
        if (mobileCategorySelect) {
            mobileCategorySelect.value = selectedFilter;
        }

        // Filter modal projects
        modalProjectCards.forEach(card => {
            const categories = card.getAttribute('data-category') ? card.getAttribute('data-category').split(' ') : [];
            
            if (selectedFilter === 'all' || categories.includes(selectedFilter)) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedFilter = button.getAttribute('data-filter');
                applyCategoryFilter(selectedFilter);
            });
        });
    }

    if (mobileCategorySelect) {
        mobileCategorySelect.addEventListener('change', (e) => {
            applyCategoryFilter(e.target.value);
        });
    }

    // 3. Forensic Competencies Slider (Left / Right Arrow Navigation)
    const prevBtn = document.getElementById('comp-prev-btn');
    const nextBtn = document.getElementById('comp-next-btn');
    const sliderTrack = document.getElementById('comp-slider-track');
    const dotsContainer = document.getElementById('comp-dots');
    const pageText = document.getElementById('comp-page-text');

    // Helper function for touch swipe gestures on mobile
    function addTouchSwipeSupport(element, onSwipeLeft, onSwipeRight) {
        if (!element) return;
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        const threshold = 35;

        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            distX = 0;
            distY = 0;
        }, { passive: true });

        element.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            const touch = e.touches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
        }, { passive: true });

        element.addEventListener('touchend', () => {
            if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) >= threshold) {
                if (distX < 0) {
                    onSwipeLeft();
                } else {
                    onSwipeRight();
                }
            }
            startX = 0;
            startY = 0;
            distX = 0;
            distY = 0;
        });
    }

    if (prevBtn && nextBtn && sliderTrack) {
        let currentPage = 0;

        function getVisibleCardsCount() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 2;
            return 3;
        }

        function getMaxPages() {
            const totalCards = sliderTrack.children.length;
            const visible = getVisibleCardsCount();
            return Math.max(0, Math.ceil(totalCards / visible) - 1);
        }

        function updateSlider() {
            const maxPages = getMaxPages();
            if (currentPage > maxPages) currentPage = maxPages;
            if (currentPage < 0) currentPage = 0;

            const visible = getVisibleCardsCount();
            const targetIndex = Math.min(currentPage * visible, sliderTrack.children.length - 1);
            const targetCard = sliderTrack.children[targetIndex];
            const firstCard = sliderTrack.children[0];
            const shiftPixels = targetCard && firstCard ? (targetCard.offsetLeft - firstCard.offsetLeft) : 0;

            sliderTrack.style.transform = `translateX(-${shiftPixels}px)`;

            // Update arrow disabled states
            prevBtn.disabled = (currentPage === 0);
            nextBtn.disabled = (currentPage >= maxPages);

            // Update page text counter
            if (pageText) {
                pageText.textContent = `Page ${currentPage + 1} of ${maxPages + 1}`;
            }

            // Render navigation dots
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i <= maxPages; i++) {
                    const dot = document.createElement('span');
                    dot.className = `dot ${i === currentPage ? 'active' : ''}`;
                    dotsContainer.appendChild(dot);
                }
            }
        }

        nextBtn.addEventListener('click', () => {
            if (currentPage < getMaxPages()) {
                currentPage++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updateSlider();
            }
        });

        // Touch Swipe Gestures for Competencies Slider
        addTouchSwipeSupport(sliderTrack, () => {
            if (!nextBtn.disabled) nextBtn.click();
        }, () => {
            if (!prevBtn.disabled) prevBtn.click();
        });

        window.addEventListener('resize', updateSlider);
        updateSlider();
    }

    // 4. Active Navbar Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // 5. Truncate Project Descriptions to 2 Lines with "Read More" Toggle
    const projectCards = document.querySelectorAll('.project');

    projectCards.forEach(card => {
        const desc = card.querySelector('.project-description');
        if (desc) {
            const toggleBtn = document.createElement('span');
            toggleBtn.className = 'read-more-btn';
            toggleBtn.textContent = '...Read More';

            desc.insertAdjacentElement('afterend', toggleBtn);

            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (desc.classList.contains('expanded')) {
                    desc.classList.remove('expanded');
                    toggleBtn.textContent = '...Read More';
                } else {
                    desc.classList.add('expanded');
                    toggleBtn.textContent = 'Show Less';
                }
            });
        }
    });

    // 6. Toggle Certifications (First row shown by default on Desktop)
    const toggleCertsBtn = document.getElementById('toggle-certs-btn');
    const extraCerts = document.querySelectorAll('.certification.cert-extra');

    if (toggleCertsBtn && extraCerts.length > 0) {
        toggleCertsBtn.addEventListener('click', () => {
            const isHidden = extraCerts[0].classList.contains('hide');

            extraCerts.forEach(cert => {
                if (isHidden) {
                    cert.classList.remove('hide');
                } else {
                    cert.classList.add('hide');
                }
            });

            toggleCertsBtn.innerHTML = isHidden 
                ? 'Show Less &uarr;' 
                : 'View All Certifications (9 Total) &darr;';
        });
    }

    // 7. Mobile View Sliders for Publications & Certifications (< 768px)
    function initMobileSlider(trackId, prevBtnId, nextBtnId, counterId, dotsId) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const pageText = document.getElementById(counterId);
        const dotsContainer = document.getElementById(dotsId);

        if (!track || !prevBtn || !nextBtn) return;

        let currentPage = 0;

        function getItems() {
            return Array.from(track.children).filter(child => {
                if (window.innerWidth <= 768 && trackId === 'cert-slider-track') return true;
                return window.getComputedStyle(child).display !== 'none';
            });
        }

        function updateSlider() {
            if (window.innerWidth > 768) {
                track.style.transform = 'none';
                return;
            }

            const items = getItems();
            const total = items.length;
            if (total === 0) return;

            const perPage = (window.innerWidth <= 768 && trackId === 'cert-slider-track') ? (window.innerWidth <= 480 ? 1 : 2) : 1;
            const maxPages = Math.ceil(total / perPage);

            if (currentPage >= maxPages) currentPage = maxPages - 1;
            if (currentPage < 0) currentPage = 0;

            const targetIndex = Math.min(currentPage * perPage, total - 1);
            const targetItem = items[targetIndex];
            const firstItem = items[0];
            const shiftPixels = targetItem && firstItem ? (targetItem.offsetLeft - firstItem.offsetLeft) : 0;

            track.style.transform = `translateX(-${shiftPixels}px)`;

            prevBtn.disabled = (currentPage === 0);
            nextBtn.disabled = (currentPage >= maxPages - 1);

            if (pageText) {
                pageText.textContent = `Page ${currentPage + 1} of ${maxPages}`;
            }

            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < maxPages; i++) {
                    const dot = document.createElement('span');
                    dot.className = `dot ${i === currentPage ? 'active' : ''}`;
                    dotsContainer.appendChild(dot);
                }
            }
        }

        nextBtn.addEventListener('click', () => {
            const items = getItems();
            const perPage = (window.innerWidth <= 768 && trackId === 'cert-slider-track') ? (window.innerWidth <= 480 ? 1 : 2) : 1;
            const maxPages = Math.ceil(items.length / perPage);
            if (currentPage < maxPages - 1) {
                currentPage++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updateSlider();
            }
        });

        // Touch Swipe Gestures for Mobile Sliders (Publications & Certifications)
        addTouchSwipeSupport(track, () => {
            if (!nextBtn.disabled) nextBtn.click();
        }, () => {
            if (!prevBtn.disabled) prevBtn.click();
        });

        window.addEventListener('resize', updateSlider);
        updateSlider();
    }

    initMobileSlider('pub-slider-track', 'pub-prev-btn', 'pub-next-btn', 'pub-page-text', 'pub-slider-dots');
    initMobileSlider('cert-slider-track', 'cert-prev-btn', 'cert-next-btn', 'cert-page-text', 'cert-slider-dots');

    // 8. Mobile Hamburger Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close dropdown when a navigation link is clicked
        const navDropdownLinks = navMenu.querySelectorAll('a');
        navDropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // 9. Lively IntersectionObserver Scroll Entrance Animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('section:not(#home), .project:not(.modal-project), .publication-item, .about-profile-card, .about-bio-card, .competency-box, .contact-info-card');
        revealElements.forEach(el => {
            el.classList.add('reveal-on-scroll');
            revealObserver.observe(el);
        });
    }
});