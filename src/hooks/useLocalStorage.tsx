import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get from local storage then parse
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen to storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch {
          console.warn('Error parsing storage event');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// Cache manager for reading passages
export interface CachedPassage {
  id: string;
  passage: {
    title: string;
    content: string;
    topic: string;
    wordCount: number;
  };
  difficulty: string;
  questions: any;
  metadata: any;
  generatedAt: string;
  userAnswers?: Record<string, string>;
  submitted?: boolean;
  score?: number;
}

export function useReadingCache() {
  const [cache, setCache] = useLocalStorage<CachedPassage[]>('ielts-reading-cache', []);

  const addToCache = (passage: CachedPassage) => {
    setCache((prev) => {
      // Keep only last 5 passages
      const updated = [passage, ...prev.filter(p => p.id !== passage.id)].slice(0, 5);
      return updated;
    });
  };

  const updateCacheEntry = (id: string, updates: Partial<CachedPassage>) => {
    setCache((prev) => 
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const getCachedPassage = (id: string) => {
    return cache.find(p => p.id === id);
  };

  const getLatestPassage = () => {
    return cache[0] || null;
  };

  const clearCache = () => {
    setCache([]);
  };

  return {
    cache,
    addToCache,
    updateCacheEntry,
    getCachedPassage,
    getLatestPassage,
    clearCache
  };
}
