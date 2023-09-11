import { determineInterval } from './interval';

export type Accidental = 'flat' | 'sharp' | 'natural';
export type RelativePosition = 'low' | 'high' | 'neutral';

export interface AbsolutePosition {
  neutralCount: number;
  highCount: number;
  lowCount: number;
}

export interface DegreeInfo {
  relativePosition: RelativePosition;
  absolutePosition: AbsolutePosition;
}

export interface ScaleAnalysis {
  errors?: Array<string>;
  degrees?: Array<DegreeInfo>;
}

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];

export function analyzeScale(degrees: Array<Accidental>): ScaleAnalysis {
  if (degrees.length !== MAJOR_SCALE.length) {
    return {
      errors: [`Количество ступеней лада не равно ${MAJOR_SCALE.length}`],
    };
  }

  const semitones = degrees.map((acc, idx) =>
    shiftDegree(MAJOR_SCALE[idx], acc),
  );

  const errors: Array<string> = [];

  for (let i = 0; i < MAJOR_SCALE.length - 1; ++i) {
    if (semitones[i] === semitones[i + 1]) {
      errors.push(`Ступень ${i + 1} совпадает со ступенью ${i + 2}`);
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  const degreeInfos: Array<DegreeInfo> = [];

  const twoOctaves = [...semitones, ...semitones.map((s) => 12 + s)];

  for (let i = 0; i < semitones.length; ++i) {
    const int = determineInterval(0, 0, i, semitones[i]);
    let relativePosition: RelativePosition;

    switch (int.quality) {
      case 'diminished':
      case 'double-diminished':
      case 'minor':
        relativePosition = 'low';
        break;

      case 'perfect':
        relativePosition = 'neutral';
        break;

      case 'major':
      case 'augmented':
      case 'double-augmented':
        relativePosition = 'high';
        break;

      default:
        throw Error(`неизвестное качество интервала: ${int.quality}`);
    }

    const absolutePosition: AbsolutePosition = {
      highCount: 0,
      lowCount: 0,
      neutralCount: 0,
    };

    for (let j = i + 1; j < i + semitones.length; ++j) {
      const int2 = determineInterval(i, twoOctaves[i], j, twoOctaves[j]);
      switch (int2.quality) {
        case 'diminished':
        case 'minor':
        case 'double-diminished':
          ++absolutePosition.highCount;
          break;

        case 'perfect':
          ++absolutePosition.neutralCount;
          break;

        case 'major':
        case 'augmented':
        case 'double-augmented':
          ++absolutePosition.lowCount;
          break;

        default:
          throw Error(`неизвестное качество интервала: ${int.quality}`);
      }
    }

    degreeInfos.push({
      relativePosition,
      absolutePosition,
    });
  }

  return { degrees: degreeInfos };
}

function shiftDegree(base: number, acc: Accidental): number {
  switch (acc) {
    case 'natural':
      return base;
    case 'flat':
      return base - 1;
    case 'sharp':
      return base + 1;
    default:
      throw Error('logic error');
  }
}
