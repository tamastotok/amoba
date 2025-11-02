import type { Board } from '@/types';

export const makeBoard = (size: number): Board =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => '' as const)
  );
