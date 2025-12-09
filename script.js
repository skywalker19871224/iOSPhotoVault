document.addEventListener('DOMContentLoaded', () => {
    const photoGrid = document.getElementById('photo-grid');
    const unlockButton = document.getElementById('unlock-button');
    const totalPhotos = 32;
    let isUnlocked = false;

    // Initialize Photos
    function renderPhotos() {
        photoGrid.innerHTML = '';

        for (let i = 0; i < totalPhotos; i++) {
            const isLockedInitial = i >= 5;
            const locked = isLockedInitial && !isUnlocked;
            const color = `hsl(${200 + (i * 5) % 40}, ${60 + (i * 3) % 20}%, ${30 + (i * 2) % 40}%)`;

            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.dataset.status = locked ? 'locked' : 'unlocked';
            photoItem.style.backgroundColor = color;

            // Add click handler for locked items
            if (locked) {
                photoItem.addEventListener('click', handleUnlockTrigger);
            }

            const photoContent = document.createElement('div');
            photoContent.className = 'photo-content';
            // Using placeholder for now
            photoContent.style.backgroundImage = 'url("https://via.placeholder.com/300")';

            const lockOverlay = document.createElement('div');
            lockOverlay.className = 'lock-overlay';
            lockOverlay.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
        `;

            photoItem.appendChild(photoContent);
            photoItem.appendChild(lockOverlay);
            photoGrid.appendChild(photoItem);
        }
    }

    // Handle Unlock Logic
    function handleUnlockTrigger() {
        if (isUnlocked) return;

        // Confirm dialog
        const confirmUnlock = window.confirm("プレミアム機能（¥500）を解除して、全ての秘密を表示しますか？\n（これはデモです。実際の課金は発生しません）");

        if (confirmUnlock) {
            // Simulate loading/processing (optional)
            setTimeout(() => {
                performUnlock();
            }, 500);
        }
    }

    function performUnlock() {
        isUnlocked = true;

        // Update Button
        if (unlockButton) {
            unlockButton.textContent = 'Select';
            unlockButton.classList.remove('add-icon'); // Assuming we swap styles, or just keep text
            unlockButton.classList.add('unlocked');
            unlockButton.onclick = () => alert("すでに解除済みです");
        }

        // Update Photos
        const photos = document.querySelectorAll('.photo-item');
        photos.forEach(photo => {
            photo.dataset.status = 'unlocked';
            photo.removeEventListener('click', handleUnlockTrigger);
            photo.style.cursor = 'default';
        });
    }

    // Bind Header Button
    if (unlockButton) {
        unlockButton.addEventListener('click', () => {
            if (isUnlocked) {
                alert("すでに解除済みです");
            } else {
                handleUnlockTrigger();
            }
        });
    }

    // Initial Render
    renderPhotos();
});
