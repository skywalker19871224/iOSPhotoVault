document.addEventListener('DOMContentLoaded', () => {
    // Feature Toggles (Chat-controllable)
    const APP_CONFIG = {
        enableFullscreenViewer: true,
        viewerMode: 'mini' // Options: 'fullscreen', 'mini'
    };

    const photoGrid = document.getElementById('photo-grid');
    const timerElement = document.getElementById('countdown-timer');
    const timerElementBig = document.getElementById('countdown-timer-big');
    const viewer = document.getElementById('fullscreen-viewer');
    const viewerClose = document.getElementById('viewer-close');
    const viewerSlider = document.getElementById('viewer-slider');
    const modal = document.getElementById('custom-modal');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');
    const passwordInput = document.getElementById('unlock-password');
    const passwordError = document.getElementById('password-error');
    const modalContent = modal.querySelector('.modal-content');
    const footerText = document.getElementById('footer-text');
    const infoFooter = document.getElementById('info-footer');
    const privacyOverlay = document.getElementById('privacy-overlay');
    const watermarkContainer = document.getElementById('watermark-container');

    let footerAutoScrollActive = true;
    let scrollRequest;

    const totalPhotos = 75;
    let isUnlocked = false;
    let photoOrder = Array.from({ length: totalPhotos }, (_, i) => i + 1);

    // Admin Check (Allow owner to skip protection)
    const isAdmin = localStorage.getItem('admin_session') === 'true';

    // Screenshot Guard Implementation
    function initScreenshotGuard() {
        if (isAdmin) {
            console.log("Admin session detected. Guard disabled.");
            return;
        }

        // 1. Visibility & Blur Guard (Disabled)
        /*
        const toggleOverlay = (active) => {
            if (active) privacyOverlay.classList.add('active');
            else privacyOverlay.classList.remove('active');
        };

        window.addEventListener('visibilitychange', () => {
            if (document.hidden) toggleOverlay(true);
            else toggleOverlay(false);
        });

        // Some browsers trigger blur on Control Center/Multitask
        window.addEventListener('blur', () => toggleOverlay(true));
        window.addEventListener('focus', () => toggleOverlay(false));
        */

        // 2. Dynamic Watermark (Disabled for now per user request)
        /*
        watermarkContainer.style.display = 'block';
        const watermarkText = "PREMIUM ALBUM • DO NOT COPY";

        for (let i = 0; i < 5; i++) {
            const el = document.createElement('div');
            el.className = 'watermark-item';
            el.textContent = watermarkText;
            watermarkContainer.appendChild(el);

            const move = () => {
                const x = Math.random() * 80;
                const y = Math.random() * 90;
                el.style.left = x + '%';
                el.style.top = y + '%';
            };
            move();
            setInterval(move, 6000 + Math.random() * 2000);
        }
        */
    }
    initScreenshotGuard();

    const padNumber = (num) => String(num).padStart(3, '0');

    // Load Footer Content from Markdown
    async function loadFooter(filename = './footer-p-01.md') {
        try {
            const response = await fetch(filename);
            if (response.ok) {
                const text = await response.text();
                // Basic MD conversion: replace newlines with <br>
                footerText.innerHTML = text.replace(/\n/g, '<br>');

                // Start Movie Credit Roll Effect
                initFooterAutoScroll();
            }
        } catch (err) {
            console.error('Failed to load footer context:', err);
        }
    }

    function initFooterAutoScroll() {
        // Reset state
        footerAutoScrollActive = true;
        infoFooter.scrollTop = 0;
        if (scrollRequest) cancelAnimationFrame(scrollRequest);

        const scrollStep = () => {
            if (!footerAutoScrollActive) return;

            infoFooter.scrollTop += 0.4; // Controlled speed for elegance

            // If reached bottom, stop
            if (infoFooter.scrollTop + infoFooter.clientHeight >= infoFooter.scrollHeight - 2) {
                footerAutoScrollActive = false;
                return;
            }

            scrollRequest = requestAnimationFrame(scrollStep);
        };

        // Delay start slightly for better feel
        setTimeout(() => {
            scrollRequest = requestAnimationFrame(scrollStep);
        }, 1000);

        // Stop on interaction
        const stopScroll = () => {
            footerAutoScrollActive = false;
            if (scrollRequest) cancelAnimationFrame(scrollRequest);
        };

        infoFooter.addEventListener('touchstart', stopScroll, { passive: true });
        infoFooter.addEventListener('mousedown', stopScroll);
        infoFooter.addEventListener('wheel', stopScroll, { passive: true });
    }
    loadFooter();

    // Fetch dynamic order from API
    async function fetchOrder() {
        try {
            const response = await fetch('/api/order');
            if (response.ok) {
                photoOrder = await response.json();
            }
        } catch (e) {
            console.warn('Using default order due to API error');
        }
        initApp();
    }

    // Countdown Timer Logic
    function updateCountdown() {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight - now;
        if (diff <= 0) {
            timerElement.textContent = "00:00:00:00";
            return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const ms = Math.floor((diff % 1000) / 10); // Centiseconds
        const timerStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(2, '0')}`;
        timerElement.textContent = timerStr;
        if (timerElementBig) timerElementBig.textContent = timerStr;
    }
    setInterval(updateCountdown, 10);
    updateCountdown();

    const showModal = () => {
        modal.classList.add('active');
        passwordInput.value = '';
        passwordError.classList.remove('visible');
    };
    const hideModal = () => {
        modal.classList.remove('active');
        passwordInput.blur();
    };

    if (modalCancel) modalCancel.addEventListener('click', hideModal);
    if (modalConfirm) {
        modalConfirm.addEventListener('click', () => {
            if (passwordInput.value === '1192') {
                hideModal();
                performUnlock();
            } else {
                modalContent.classList.add('shake');
                passwordError.classList.add('visible');
                setTimeout(() => modalContent.classList.remove('shake'), 500);
                passwordInput.select();
            }
        });
    }

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') modalConfirm.click();
    });

    if (viewerClose) {
        viewerClose.addEventListener('click', (e) => {
            e.stopPropagation();
            viewer.classList.remove('active');
        });
    }

    // Initialize Swipe Viewer Slides
    function initViewer() {
        viewerSlider.innerHTML = '';
        photoOrder.forEach((photoId, index) => {
            const slide = document.createElement('div');
            slide.className = 'viewer-slide';
            slide.dataset.index = index;

            const img = document.createElement('img');
            img.dataset.src = `./public/gallery/img_${padNumber(photoId)}.jpg`;
            img.alt = `Slide ${photoId}`;

            slide.addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG' || e.target === slide) {
                    viewer.classList.remove('active');
                }
            });

            slide.appendChild(img);

            // Add SAMPLE watermark to every image
            const watermark = document.createElement('div');
            watermark.className = 'sample-watermark';
            watermark.textContent = 'SAMPLE';
            slide.appendChild(watermark);

            viewerSlider.appendChild(slide);
        });
    }

    function loadNearbyImages(index) {
        const slides = viewerSlider.querySelectorAll('.viewer-slide');
        const range = 2;
        for (let i = index - range; i <= index + range; i++) {
            if (i >= 0 && i < photoOrder.length) {
                const img = slides[i].querySelector('img');
                if (img && img.dataset.src && !img.src) {
                    img.src = img.dataset.src;
                }
            }
        }
    }

    function renderGrid() {
        photoGrid.innerHTML = '';
        photoOrder.forEach((photoId, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.dataset.status = isUnlocked ? 'unlocked' : 'locked';

            const photoImage = document.createElement('div');
            photoImage.className = 'photo-image';
            photoImage.style.backgroundImage = `url('./public/gallery/img_${padNumber(photoId)}.jpg')`;

            const lockOverlay = document.createElement('div');
            lockOverlay.className = 'lock-overlay';
            lockOverlay.innerHTML = `
                <svg class="lock-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
            `;

            photoItem.addEventListener('click', () => {
                if (!isUnlocked) {
                    showModal();
                } else if (APP_CONFIG.enableFullscreenViewer) {
                    openViewer(index);
                }
            });

            photoItem.appendChild(photoImage);
            photoItem.appendChild(lockOverlay);

            // Add SAMPLE watermark to every image
            const watermark = document.createElement('div');
            watermark.className = 'sample-watermark';
            watermark.textContent = 'SAMPLE';
            photoItem.appendChild(watermark);

            photoGrid.appendChild(photoItem);
        });
    }

    function openViewer(index) {
        viewer.dataset.mode = APP_CONFIG.viewerMode;
        viewer.classList.add('active');
        const slideWidth = viewerSlider.offsetWidth;
        viewerSlider.scrollLeft = index * slideWidth;
        loadNearbyImages(index);
    }

    viewerSlider.addEventListener('scroll', () => {
        const index = Math.round(viewerSlider.scrollLeft / viewerSlider.offsetWidth);
        loadNearbyImages(index);
    });

    function performUnlock() {
        isUnlocked = true;
        loadFooter('./footer-p-02.md'); // Switch to post-unlock message
        const items = document.querySelectorAll('.photo-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.dataset.status = 'unlocked';
            }, index * 5);
        });
    }

    function initApp() {
        initViewer();
        renderGrid();
    }

    fetchOrder();
});
