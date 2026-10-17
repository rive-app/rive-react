import React, { useState } from 'react';
import { useRive, Fit, Alignment, Layout } from '@rive-app/react-webgl2';
import type { UseRiveParameters, UseRiveOptions } from '@rive-app/react-webgl2';

/**
 * Inkbleed — experimental 1x analytic antialiasing (webgl2 only)
 */

const CARD_SIZE = 380;
const LAYOUT = new Layout({ fit: Fit.Contain, alignment: Alignment.Center });

interface CardProps {
  title: string;
  expectInkbleed: boolean;
  params: UseRiveParameters;
  opts?: Partial<UseRiveOptions>;
}

const Card = ({ title, expectInkbleed, params, opts }: CardProps) => {
  const { rive, RiveComponent } = useRive(params, opts);
  // What this card currently asks for; the Toggle button flips it.
  const [expected, setExpected] = useState(expectInkbleed);

  let label = 'loading…';
  let color: string = COLORS.textMuted;

  if (rive) {
    const on = rive.inkbleed;
    const ok = on === expected;
    label = `inkbleed ${on ? 'on' : 'off'} ${
      ok ? '✓' : `✗ expected ${expected ? 'on' : 'off'}`
    }`;
    color = ok ? COLORS.pass : COLORS.fail;
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <div style={{ width: CARD_SIZE, height: CARD_SIZE }}>
        <RiveComponent
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
      <div style={styles.footer}>
        <span style={{ ...styles.status, color }}>{label}</span>
        {params?.enableInkbleed && (
          <button
            style={styles.button}
            disabled={!rive}
            onClick={() => {
              if (!rive) return;
              const next = !expected;
              rive.inkbleed = next;
              setExpected(next);
            }}
          >
            Toggle
          </button>
        )}
      </div>
    </div>
  );
};

const params = (extra?: Partial<UseRiveParameters>): UseRiveParameters => ({
  src: 'tiger.riv',
  autoplay: true,
  layout: LAYOUT,
  ...extra,
});

const Inkbleed = () => (
  <div style={styles.page}>
    <div style={styles.inner}>
      <h1 style={styles.h1}>Inkbleed</h1>
      <p style={styles.intro}>
        Inkbleed replaces MSAA with 1x analytic antialiasing. Everything bleeds
        out half a pixel, which is most visible on thin strokes like the
        whiskers. Fills that don't use the clockwise fill rule are converted to
        clockwise on a best-effort basis.
      </p>

      <section style={styles.section}>
        <div style={styles.grid}>
          <Card
            title="enableInkbleed"
            expectInkbleed
            params={params({ enableInkbleed: true })}
          />
        </div>
      </section>
    </div>
  </div>
);

const COLORS = {
  bg: '#1a1a1a',
  panel: '#252525',
  border: '#3a3a3a',
  text: '#e0e0e0',
  textMuted: '#999',
  pass: '#4caf50',
  fail: '#ff4d40',
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: 'system-ui, sans-serif',
    minHeight: '100vh',
    boxSizing: 'border-box',
    padding: 24,
  },
  inner: { width: 'min(92%, 1240px)', margin: '0 auto' },
  h1: { margin: '0 0 6px', fontSize: 22, fontWeight: 600 },
  intro: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 1.6,
    margin: '0 0 20px',
  },
  section: { marginBottom: 28 },
  grid: { display: 'flex', flexWrap: 'wrap', gap: 16 },
  card: {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: 12,
  },
  cardTitle: { fontSize: 13, fontWeight: 600, margin: '0 0 8px' },
  footer: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: { fontSize: 13, fontWeight: 600 },
  button: { fontSize: 12, padding: '2px 10px' },
};

export default Inkbleed;
