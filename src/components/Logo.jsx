const LOGO_SRC = `${import.meta.env.BASE_URL}assets/logo-sapience-placeholder.webp`;

export default function Logo({ size = 88, withText = true, light = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <img src={LOGO_SRC} alt="Sapience" width={size} height={size} draggable={false} />
      {withText && (
        <div style={{ textAlign: 'center', color: light ? '#fff' : 'var(--olive-700)' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: size * 0.24,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            SAPIENCE
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: size * 0.1,
              letterSpacing: 3,
              opacity: 0.9,
              marginTop: 4,
            }}
          >
            OLIMPIADAS CIENTIFICAS
          </div>
        </div>
      )}
    </div>
  );
}
