export default function Home() {
  const photos = Array.from({ length: 40 }).map((_, i) => i);

  return (
    <div style={{ paddingBottom: '83px', minHeight: '100vh', background: 'var(--ios-bg)' }}>
      {/* Sticky Header */}
      <header className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        paddingTop: 'max(47px, env(safe-area-inset-top))', /* Status bar area */
        paddingBottom: '12px',
        paddingLeft: '16px',
        paddingRight: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 'calc(44px + max(47px, env(safe-area-inset-top)))'
      }}>
        {/* Fake space to balance content if needed, for now just space-between */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          letterSpacing: '0.3px',
          lineHeight: 1
        }}>
          Library
        </h1>
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--ios-blue)',
          fontSize: '17px',
          fontWeight: '600',
          cursor: 'pointer',
          padding: '4px 0'
        }}>
          Select
        </button>
      </header>

      {/* Photo Grid */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px',
        paddingBottom: '20px'
      }}>
        {photos.map((i) => (
          <div key={i} style={{
            aspectRatio: '1',
            backgroundColor: `hsl(0, 0%, ${10 + (i % 20)}%)`,
            position: 'relative'
          }}>
            {/* Placeholder for images */}
          </div>
        ))}
      </main>

      {/* Tab Bar (Fixed Bottom) */}
      <nav className="glass-panel" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '84px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        paddingTop: '10px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'start',
        borderTop: '0.5px solid rgba(255,255,255,0.15)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--ios-blue)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="4" opacity="0.5" />
            <rect x="4" y="4" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="13" y="4" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="4" y="13" width="7" height="7" rx="1" fill="currentColor" />
            <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" />
          </svg>
          <span style={{ fontSize: '10px', fontWeight: '500' }}>Library</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--ios-secondary-text)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span style={{ fontSize: '10px', fontWeight: '500' }}>For You</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--ios-secondary-text)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span style={{ fontSize: '10px', fontWeight: '500' }}>Albums</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--ios-secondary-text)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: '10px', fontWeight: '500' }}>Search</span>
        </div>
      </nav>
    </div>
  );
}

