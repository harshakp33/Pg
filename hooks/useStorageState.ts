'use client';

import { useState, useEffect, useCallback } from 'react';
import { getItem, isBrowser } from '@/lib/storage';

export function useStorageState<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [data, setData] = useState<T>(defaultValue);

  useEffect(() => {
    setData(getItem<T>(key, defaultValue));

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === key) {
        setData(customEvent.detail.value ?? defaultValue);
      }
    };

    const handleReset = () => {
      setData(getItem<T>(key, defaultValue));
    };

    window.addEventListener('pg_storage_change', handleStorageChange);
    window.addEventListener('pg_data_reset', handleReset);

    return () => {
      window.removeEventListener('pg_storage_change', handleStorageChange);
      window.removeEventListener('pg_data_reset', handleReset);
    };
  }, [key, defaultValue]);

  const update = useCallback(
    (newVal: T) => {
      setData(newVal);
    },
    []
  );

  return [data, update];
}
