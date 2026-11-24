/**
 * client/src/i18n/useT.js
 * Translation hook. Reads language from the store and persists in localStorage.
 */

import { useCallback } from 'react';
import { useNeevStore } from '../store/useNeevStore.js';
import en from './en.js';
import hi from './hi.js';

const DICT = { en, hi };

export function useT() {
  const lang = useNeevStore((s) => s.lang);
  const dict = DICT[lang] || DICT.en;

  const t = useCallback(
    (key, vars = {}) => {
      let str = dict[key] ?? en[key] ?? key;
      // Replace {var} placeholders
      for (const [k, v] of Object.entries(vars)) {
        str = str.replaceAll(`{${k}}`, String(v));
      }
      return str;
    },
    [dict]
  );

  return t;
}
