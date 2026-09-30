import React from 'react';
import { useRive, SemanticMode } from '@rive-app/react-canvas';

/**
 * Text input fields and keyboard/text listeners. Rive handles keyboard input
 * once its canvas is focused, so every canvas here gets `tabIndex: 0`.
 */

// Inline (not a shared CSSProperties) because RiveComponent's style type comes
// from the root package's @types/react.
const canvasStyle = (height: number) => ({
  position: 'relative' as const,
  width: 480,
  height,
  border: '1px solid #ccc',
  margin: '12px 0',
});

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: 'system-ui, sans-serif', padding: 24 },
  description: { maxWidth: 640, lineHeight: 1.5 },
  row: { display: 'flex', flexWrap: 'wrap', gap: 16 },
};

// `position: relative` on the container is required for the semantics overlay.
const LoginFormCanvas = ({ semantics }: { semantics: boolean }) => {
  const { RiveComponent } = useRive({
    src: 'text_input_semantics.riv',
    stateMachine: 'State Machine 1',
    autoplay: true,
    autoBind: true,
    tabIndex: 0,
    ...(semantics ? { semanticsMode: SemanticMode.Enabled } : {}),
  });
  return <RiveComponent style={canvasStyle(360)} />;
};

export const LoginForm = ({ semantics }: { semantics: boolean }) => (
  <div style={styles.page}>
    <p style={styles.description}>
      {semantics
        ? 'Semantics enabled: fields are mirrored by hidden DOM inputs, so screen readers and the browser Tab order see them. '
        : 'Semantics disabled: the canvas is focusable and Rive handles focus between its own fields. '}
      Click the Email field and type, try Backspace, Cmd/Ctrl+A and Cmd/Ctrl+C,
      then Tab to Password (obscured) and on to the After button. Shift+Tab
      walks back out through Before to the page button above the canvas.
    </p>
    <button type="button">Before</button>
    <LoginFormCanvas semantics={semantics} />
    <button type="button">After</button>
  </div>
);

const ListenerCanvas = ({ src }: { src: string }) => {
  const { RiveComponent } = useRive({
    src,
    artboard: 'Main',
    stateMachine: 'State Machine 1',
    autoplay: true,
    autoBind: true,
    tabIndex: 0,
  });
  return <RiveComponent style={canvasStyle(320)} />;
};

export const MultilineAndListeners = () => (
  <div style={styles.page}>
    <p style={styles.description}>
      Left: a single-line Title and a multiline Message field, two-way bound to
      view model readouts. Type in each; Enter inserts a newline in Message
      only. Right: <strong>Both</strong> has keyboard and text listeners with
      counters,
      <strong>KeysOnly</strong> has keyboard listeners only, and{' '}
      <strong>Field</strong> is a native text input. Click a node, type and
      press keys to watch the counters.
    </p>
    <div style={styles.row}>
      <ListenerCanvas src="multiline-text-input.riv" />
      <ListenerCanvas src="key-and-text-listeners.riv" />
    </div>
  </div>
);
