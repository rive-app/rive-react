import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRive, SemanticMode, Fit, Layout } from '@rive-app/react-canvas';

/**
 * Testing semantics tree feature in Rive. Enable your accessibility tool to traverse the examples here (i.e. VoiceOver).
 * Semantics is an opt-in feature in Rive, by passing in `semanticsMode: SemanticMode.Enabled` to `useRive`.
 *
 * @experimental The semantics API is early and may change without a major bump.
 */

// The example .riv files, copied into examples/public. Each is loaded with the
// file's default artboard and a state machine named "State Machine 1".
const RIV_FILES = ['data_binding_lists.riv', 'semantic_warning_exp4.riv'];

type FitValue = 'contain' | 'cover' | 'layout';

const FIT_BY_VALUE: Record<FitValue, Fit> = {
  contain: Fit.Contain,
  cover: Fit.Cover,
  layout: Fit.Layout,
};

type LoadSource = { src: string } | { buffer: ArrayBuffer };

function buildLayout(fit: FitValue, scale: number): Layout {
  const resolvedFit = FIT_BY_VALUE[fit];
  if (resolvedFit === Fit.Layout) {
    return new Layout({
      fit: resolvedFit,
      layoutScaleFactor: Number.isFinite(scale) && scale > 0 ? scale : 1,
    });
  }
  return new Layout({ fit: resolvedFit });
}

/**
 * Wraps a single Rive instance for the currently selected source. The parent
 * remounts this (via `key`) whenever the source changes
 */
interface RiveStageProps {
  source: LoadSource;
  label: string;
  fit: FitValue;
  scale: number;
  onLog: (message: string) => void;
}

const RiveStage = ({ source, label, fit, scale, onLog }: RiveStageProps) => {
  const layout = useMemo(() => buildLayout(fit, scale), [fit, scale]);

  const { rive, RiveComponent } = useRive({
    ...source,
    stateMachines: 'State Machine 1',
    autoplay: true,
    autoBind: true,
    layout,
    semanticsMode: SemanticMode.Enabled,
    semanticsOptions: {
      riveCanvasLabel: 'Rive animation',
    },
    tabIndex: 0,
    automaticallyHandleEvents: true,
    onLoad: () => onLog(`Loaded ${label}`),
    onLoadError: (e) => onLog(`Error loading ${label}: ${e}`),
  });

  // Re-apply the layout when fit / scale change, without remounting.
  useEffect(() => {
    if (!rive) return;
    rive.layout = layout;
    rive.resizeDrawingSurfaceToCanvas();
  }, [rive, layout]);

  return (
    <RiveComponent
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};

const Semantics = () => {
  const [source, setSource] = useState<LoadSource | null>(null);
  const [label, setLabel] = useState('');
  // Bumped on every load to force a fresh RiveStage (clean reload).
  const [loadKey, setLoadKey] = useState(0);
  const [fit, setFit] = useState<FitValue>('contain');
  const [scale, setScale] = useState(1);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLPreElement>(null);

  const log = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogLines((prev) => [...prev, `[${timestamp}] ${message}`]);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [logLines]);

  const load = useCallback(
    (nextSource: LoadSource, nextLabel: string) => {
      setLogLines([]);
      log(`Loading ${nextLabel}…`);
      setSource(nextSource);
      setLabel(nextLabel);
      setLoadKey((k) => k + 1);
    },
    [log]
  );

  const loadExample = useCallback(
    (filename: string) => {
      if (!filename) return;
      load({ src: filename }, filename);
    },
    [load]
  );

  const loadLocalFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith('.riv')) {
        log(`Ignored "${file.name}" — not a .riv file`);
        return;
      }
      const buffer = await file.arrayBuffer();
      load({ buffer }, file.name);
    },
    [load, log]
  );

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    loadExample(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadLocalFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadLocalFile(file);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Rive Semantics Test</h1>

      <div style={styles.app}>
        <div style={styles.controls}>
          <label style={{ ...styles.control, flex: '1 1 auto' }}>
            <span style={styles.controlLabel}>Example:</span>
            <select
              value={source && 'src' in source ? label : ''}
              onChange={onSelectChange}
              style={styles.select}
            >
              <option value="">Select an example…</option>
              {RIV_FILES.map((file) => (
                <option key={file} value={file}>
                  {file.replace(/\.riv$/, '')}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.control}>
            <span style={styles.controlLabel}>Fit:</span>
            <select
              value={fit}
              onChange={(e) => setFit(e.target.value as FitValue)}
              style={styles.select}
            >
              <option value="contain">Contain</option>
              <option value="cover">Cover</option>
              <option value="layout">Layout</option>
            </select>
          </label>

          {fit === 'layout' && (
            <label style={styles.control}>
              <span style={styles.controlLabel}>Scale:</span>
              <input
                type="number"
                value={scale}
                min={0.1}
                step={0.1}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                style={{ ...styles.input, width: 80 }}
              />
            </label>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={styles.button}
          >
            Upload .riv
          </button>
        </div>

        <div
          style={styles.stage}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
        >
          {source && (
            <div style={{ width: '100%', height: '100%' }}>
              <RiveStage
                key={loadKey}
                source={source}
                label={label}
                fit={fit}
                scale={scale}
                onLog={log}
              />
            </div>
          )}

          {(!source || isDragOver) && (
            <div
              style={{
                ...styles.dropzone,
                ...(isDragOver ? styles.dropzoneActive : null),
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <strong>Drop a .riv file here</strong>
              <span style={styles.dropzoneHint}>
                or click to browse — or pick an example above
              </span>
            </div>
          )}
        </div>

        <pre ref={outputRef} style={styles.output}>
          {logLines.length
            ? logLines.join('\n')
            : 'Select an example or drop a .riv file to begin…'}
        </pre>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".riv"
        hidden
        onChange={onFileChange}
      />
    </div>
  );
};

// Inline styles mirroring the source app's dark theme.
const COLORS = {
  bg: '#1a1a1a',
  panel: '#252525',
  border: '#3a3a3a',
  text: '#e0e0e0',
  textMuted: '#999',
  accent: '#6c8eef',
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
  h1: {
    width: 'min(90%, 960px)',
    margin: '0 auto 16px',
    fontSize: 22,
    fontWeight: 600,
  },
  app: {
    width: 'min(90%, 960px)',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: 12,
  },
  control: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  select: {
    background: COLORS.bg,
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: '6px 8px',
    fontSize: 14,
    width: '100%',
  },
  input: {
    background: COLORS.bg,
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: '6px 8px',
    fontSize: 14,
  },
  button: {
    background: COLORS.bg,
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: '6px 12px',
    fontSize: 14,
    cursor: 'pointer',
  },
  stage: {
    position: 'relative',
    height: 'min(70vh, 600px)',
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropzone: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    border: `2px dashed ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.text,
    cursor: 'pointer',
    textAlign: 'center',
  },
  dropzoneActive: {
    borderColor: COLORS.accent,
    background: '#2b3040',
  },
  dropzoneHint: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  output: {
    margin: 0,
    maxHeight: 300,
    overflow: 'auto',
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'ui-monospace, monospace',
    fontSize: 13,
    color: '#aaa',
    whiteSpace: 'pre-wrap',
  },
};

export default Semantics;
