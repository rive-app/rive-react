import { useState, useEffect } from 'react';
import type { UseRiveFileParameters } from '../types';
import { RiveFile } from '@rive-app/canvas';

/**
 * Custom hook for initializing and managing a RiveFile instance within a component.
 * It sets up a RiveFile based on provided source parameters (URL or ArrayBuffer) and ensures
 * proper cleanup to avoid memory leaks when the component unmounts or inputs change.
 *
 * @param params - Object containing parameters accepted by the Rive file in the rive-js runtime,
 *
 * @returns {RiveFile} Contains the active RiveFile instance (`riveFile`).
 */
function useRiveFile(params: UseRiveFileParameters) {
  const [riveFile, setRiveFile] = useState<RiveFile | null>(null);

  useEffect(() => {
    let file: RiveFile | null = null;

    const loadRiveFile = async () => {
      file = new RiveFile(params);
      setRiveFile(file);
    };

    loadRiveFile();

    return () => {
      if (file) {
        file.cleanup();
      }
    };
  }, [params.src, params.buffer]);


  return { riveFile };
}

export default useRiveFile;
