// Module-level singleton — survives React component unmount/remount
// Enables background generation: user can navigate away while generation continues

export type GenModuleKey = 'reading' | 'listening' | 'writing' | 'speaking';

export interface GenEntry {
  isGenerating: boolean;
  result: any | null;
  error: string | null;
  config?: Record<string, any>;
}

function defaultEntry(): GenEntry {
  return { isGenerating: false, result: null, error: null };
}

const _store: Record<GenModuleKey, GenEntry> = {
  reading: defaultEntry(),
  listening: defaultEntry(),
  writing: defaultEntry(),
  speaking: defaultEntry(),
};

const _listeners: Set<() => void> = new Set();

function notify() {
  _listeners.forEach(fn => fn());
}

export const generationStore = {
  get(module: GenModuleKey): GenEntry {
    return _store[module];
  },

  startGen(module: GenModuleKey, config?: Record<string, any>) {
    _store[module] = { isGenerating: true, result: null, error: null, config };
    notify();
  },

  finishGen(module: GenModuleKey, result: any) {
    _store[module] = {
      isGenerating: false,
      result,
      error: null,
      config: _store[module].config,
    };
    notify();
  },

  failGen(module: GenModuleKey, error: string) {
    _store[module] = {
      isGenerating: false,
      result: null,
      error,
      config: _store[module].config,
    };
    notify();
  },

  clearEntry(module: GenModuleKey) {
    _store[module] = defaultEntry();
    notify();
  },

  subscribe(listener: () => void): () => void {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  },
};
