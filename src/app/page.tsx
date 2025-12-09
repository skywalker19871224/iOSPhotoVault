import React from 'react';

export default function Home() {
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Generate dummy photos
  // Use useMemo to keep colors stable across re-renders
  const photos = React.useMemo(() => Array.from({ length: 32 }).map((_, i) => ({
    id: i,
    // First 5 are always free, others depend on global unlock state
    isLockedInitial: i >= 5,
    color: `hsl(${200 + (i * 5) % 40}, ${60 + (i * 3) % 20}%, ${30 + (i * 2) % 40}%)`
  })), []);

  const handleUnlock = () => {
    if (isUnlocked) return;

    // Simulate 'Purchasing' delay or interaction
    const confirmUnlock = window.confirm("プレミアム機能（¥500）を解除して、全ての秘密を表示しますか？\n（これはデモです。実際の課金は発生しません）");

    if (confirmUnlock) {
      setIsAnimating(true);
      // Determine unlock timing
      setTimeout(() => {
        setIsUnlocked(true);
        setIsAnimating(false);
      }, 500); // Slight delay for anticipation
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ios-bg)' }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(30, 30, 30, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 100,
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        paddingBottom: '12px',
        paddingLeft: '16px',
        paddingRight: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '0.5px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '800', margin: 0, lineHeight: 1, letterSpacing: '0.5px' }}>
          ライブラリ
        </h1>
        <button
          onClick={() => isUnlocked ? alert("すでに解除済みです") : handleUnlock()}
          style={{
            background: 'none',
            border: 'none',
            color: isUnlocked ? '#34c759' : '#007AFF', // Green if unlocked
            fontSize: '17px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '4px 0',
            transition: 'color 0.3s'
          }}>
          {isUnlocked ? 'Select' : 'Unlock'}
        </button>
      </header>

      {/* Photo Grid */}
      <main style={{
        paddingTop: 'calc(60px + max(16px, env(safe-area-inset-top)))',
        paddingBottom: 'calc(83px + env(safe-area-inset-bottom))', // Space for tab bar
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
      }}>
        {photos.map((photo) => {
          // Determine if this specific photo is currently locked
          const locked = photo.isLockedInitial && !isUnlocked;

          return (
            <div
              key={photo.id}
              className="photo-item"
              data-status={locked ? 'locked' : 'unlocked'}
              onClick={locked ? handleUnlock : undefined}
              style={{
                backgroundColor: photo.color,
              }}
            >
              {/* Image Content */}
              <div
                className="photo-content"
                style={{
                  backgroundImage: 'url("https://via.placeholder.com/300")',
                }}
              />

              {/* Lock Icon Overlay - Animate out */}
              <div className="lock-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
