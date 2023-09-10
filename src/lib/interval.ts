export type Quality =
  | 'perfect'
  | 'minor'
  | 'major'
  | 'augmented'
  | 'diminished';

export interface Interval {
  /** 1..7 */
  quantity: number;
  quality: Quality;
}

const INTERVALS: Array<Record<number, Quality>> = [
  // прима
  { 0: 'perfect', 1: 'augmented' },

  // секунда
  {
    1: 'minor',
    2: 'major',
    3: 'augmented',
  },

  // терция
  {
    2: 'diminished',
    3: 'minor',
    4: 'major',
    5: 'augmented',
  },

  // кварта
  {
    4: 'diminished',
    5: 'perfect',
    6: 'augmented',
  },

  // квинта
  {
    6: 'diminished',
    7: 'perfect',
    8: 'augmented',
  },

  // секста
  {
    7: 'diminished',
    8: 'minor',
    9: 'major',
    10: 'augmented',
  },

  // септима
  {
    9: 'diminished',
    10: 'minor',
    11: 'major',
  },
];

export function determineInterval(
  idx1: number,
  sem1: number,
  idx2: number,
  sem2: number,
): Interval {
  const diff = Math.abs(idx1 - idx2);
  if (diff < 0 || diff >= INTERVALS.length) {
    throw Error(`неизвестный интервал: ${diff} ступеней`);
  }

  const intDef = INTERVALS[diff];
  const semDiff = Math.abs(sem1 - sem2);
  if (semDiff in intDef) {
    const quality = intDef[semDiff];
    return { quantity: diff + 1, quality };
  } else {
    throw Error(
      `У интервала ${diff + 1} неправильное кол-во полутонов: ${semDiff}`,
    );
  }
}
