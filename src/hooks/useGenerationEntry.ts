import { useState, useEffect } from 'react';
import { generationStore, type GenModuleKey, type GenEntry } from '@/stores/generationStore';

/**
 * Subscribes to the module-level generation store.
 * Updates whenever startGen / finishGen / failGen / clearEntry is called.
 * Safe across component unmount/remount — store outlives any component.
 */
export function useGenerationEntry(module: GenModuleKey): GenEntry {
  const [entry, setEntry] = useState<GenEntry>(() => generationStore.get(module));

  useEffect(() => {
    // Sync immediately on mount (store may have updated while unmounted)
    setEntry({ ...generationStore.get(module) });

    return generationStore.subscribe(() => {
      setEntry({ ...generationStore.get(module) });
    });
  }, [module]);

  return entry;
}
