import React from 'react';
import {
  useRive,
  useRiveFile,
  Fit,
  Alignment,
  Layout,
} from '@rive-app/react-webgl2';
import type { UseRiveParameters } from '@rive-app/react-webgl2';

/**
 * GPU Canvas — multi-instance matrix
 */

interface RivExample {
  src: string;
  artboard: string;
  stateMachine: string;
  width: number;
  height: number;
}

// Shader-driven files, so they need the webgl2 alias in .storybook/main.ts.
const ORE: RivExample = {
  src: 'ore.riv',
  artboard: 'Artboard',
  stateMachine: 'State Machine 1',
  width: 900,
  height: 320,
};

const MULTI_STAGE: RivExample = {
  ...ORE,
  src: 'multi-stage.riv',
  width: 500,
  height: 500,
};

const CARD_WIDTH = 380;
const LAYOUT = new Layout({ fit: Fit.Contain, alignment: Alignment.Center });

const paramsFor = (riv: RivExample) => ({
  autoplay: true,
  artboard: riv.artboard,
  stateMachine: riv.stateMachine,
  layout: LAYOUT,
});

interface CardProps {
  title: string;
  expectDeferred: boolean;
  /** `null` until a pre-imported RiveFile is ready; useRive skips construction. */
  params: UseRiveParameters;
  riv: RivExample;
}

const Card = ({ title, expectDeferred, params, riv }: CardProps) => {
  const { rive, RiveComponent } = useRive(params);

  let label = 'loading…';
  let color: string = COLORS.textMuted;

  if (rive) {
    const active = rive.deferredRendererActive;
    const ok = active === expectDeferred;
    label = `${active ? 'deferred' : 'immediate'} ${
      ok ? '✓' : `✗ expected ${expectDeferred ? 'deferred' : 'immediate'}`
    }`;
    color = ok ? COLORS.pass : COLORS.fail;
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <div
        style={{
          width: CARD_WIDTH,
          height: Math.round((CARD_WIDTH * riv.height) / riv.width),
        }}
      >
        <RiveComponent
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
      <div style={{ ...styles.status, color }}>{label}</div>
    </div>
  );
};

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section style={styles.section}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <p style={styles.sectionDesc}>{description}</p>
    <div style={styles.grid}>{children}</div>
  </section>
);

const deferredCard = (title: string, riv: RivExample) => (
  <Card
    title={title}
    expectDeferred
    riv={riv}
    params={{ ...paramsFor(riv), src: riv.src, enableGPUCanvas: true }}
  />
);

/** C and D need the file imported for GPU Canvas before any instance uses it. */
const SharedFileScenarios = () => {
  const shared = useRiveFile({ src: ORE.src, enableGPUCanvas: true });
  const mismatch = useRiveFile({ src: ORE.src, enableGPUCanvas: true });

  const sharedReady = shared.status === 'success' ? shared.riveFile : null;
  const mismatchReady = mismatch.status === 'success' ? mismatch.riveFile : null;

  return (
    <>
      <Section
        title="C — Shared deferred RiveFile"
        description="One file, two instances. The first claims the session; the second warns once and re-imports from the retained buffer (extra parse, no extra fetch). Both must render deferred."
      >
        {['shared file #1 (claims session)', 'shared file #2 (re-import)'].map(
          (title) => (
            <Card
              key={title}
              title={title}
              expectDeferred
              riv={ORE}
              params={
                sharedReady
                  ? {
                      ...paramsFor(ORE),
                      riveFile: sharedReady,
                      enableGPUCanvas: true,
                    }
                  : null
              }
            />
          )
        )}
      </Section>

      <Section
        title="D — File wins on mismatch"
        description="A deferred file handed to an instance with `enableGPUCanvas: false`. An immediate renderer would drop the file's deferred resources, so the file wins: it renders deferred anyway and warns. rive-react reads the file's mode too, turning the offscreen renderer off even though this instance never asked."
      >
        <Card
          title="deferred file, flag false"
          expectDeferred
          riv={ORE}
          params={
            mismatchReady
              ? {
                  ...paramsFor(ORE),
                  riveFile: mismatchReady,
                  enableGPUCanvas: false,
                }
              : null
          }
        />
      </Section>
    </>
  );
};

const GPUCanvasDeferred = () => (
  <div style={styles.page}>
    <div style={styles.inner}>
      <h1 style={styles.h1}>GPU Canvas — multi-instance matrix</h1>
      <p style={styles.intro}>
        Four arrangements of deferred and immediate instances on one page. Each
        card reports the mode it resolved to and whether that matches the
        scenario. Keep devtools open — C and D are supposed to warn.
      </p>

      <Section
        title="A — Two independent deferred instances"
        description="Two sessions coexisting. The first two load their own copy of the same file; the third is a different file, covering unrelated sessions rather than clones. All three must report deferred."
      >
        {deferredCard('deferred #1 (ore.riv)', ORE)}
        {deferredCard('deferred #2 (ore.riv, own copy)', ORE)}
        {deferredCard('deferred #3 (multi-stage.riv)', MULTI_STAGE)}
      </Section>

      <Section
        title="B — Deferred + immediate side by side"
        description="The immediate instance must still draw. It previously went blank once any deferred renderer existed, because import was routed through a module-global session. This file needs the deferred path for its shader content, so here the mode is the assertion, not the pixels."
      >
        {deferredCard('deferred', ORE)}
        <Card
          title="immediate"
          expectDeferred={false}
          riv={ORE}
          params={{ ...paramsFor(ORE), src: ORE.src }}
        />
      </Section>

      <SharedFileScenarios />
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
  inner: { width: 'min(92%, 1100px)', margin: '0 auto' },
  h1: { margin: '0 0 6px', fontSize: 22, fontWeight: 600 },
  intro: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 1.6,
    margin: '0 0 20px',
  },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 15, fontWeight: 600, margin: '0 0 4px' },
  sectionDesc: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 1.5,
    margin: '0 0 12px',
  },
  grid: { display: 'flex', flexWrap: 'wrap', gap: 16 },
  card: {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: 12,
  },
  cardTitle: { fontSize: 13, fontWeight: 600, margin: '0 0 8px' },
  status: { marginTop: 8, fontSize: 13, fontWeight: 600 },
};

export default GPUCanvasDeferred;
