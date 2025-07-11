"use client";

import { useSyncExternalStore } from "react";
import type { Atom } from "./atom";

export function useAtom<T>(atom: Atom<T>): [T, (val: T) => void] {
  const state = useSyncExternalStore(
    atom.subscribe,
    () => {
      const value = atom.get();
      return value;
    },
    () => {
      const value = atom.get();
      return value;
    },
  );

  return [state, atom.set];
}
