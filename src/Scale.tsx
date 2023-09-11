import React, { useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  ChipProps,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Accidental, analyzeScale, DegreeInfo } from './lib/scale-logic';

type Direction = 'lower' | 'raise';

interface DegreeProps {
  no: number;
  accidental: Accidental;

  setAccidental: (acc: Accidental) => void;
  canRaise: boolean;
  canLower: boolean;

  absolutePositionBgColor?: string;
  absolutePositionColor?: string;

  info?: DegreeInfo;
}

const raiseDegree = (acc: Accidental): Accidental =>
  acc === 'flat' ? 'natural' : acc === 'natural' ? 'sharp' : acc;

const lowerDegree = (acc: Accidental): Accidental =>
  acc === 'sharp' ? 'natural' : acc === 'natural' ? 'flat' : acc;

const degreeName = ({
  no,
  accidental,
}: Pick<DegreeProps, 'no' | 'accidental'>) =>
  accidental === 'flat' ? `♭${no}` : accidental === 'sharp' ? `♯${no}` : no;

const DegreeInformation = ({
  info,
  absolutePositionBgColor,
  absolutePositionColor,
}: Pick<
  DegreeProps,
  'info' | 'absolutePositionBgColor' | 'absolutePositionColor'
>) => {
  if (!info) {
    return <></>;
  }

  const {
    relativePosition,
    absolutePosition: { highCount, lowCount, neutralCount },
  } = info;

  let color: ChipProps['color'];
  let name: string;

  switch (relativePosition) {
    case 'neutral':
      color = 'default';
      name = 'нейтральн.';
      break;

    case 'high':
      color = 'high';
      name = 'высокая';
      break;

    case 'low':
      color = 'low';
      name = 'низкая';
      break;
  }

  return (
    <>
      <p>
        Отн. <Chip label={name} color={color} size="small" />
      </p>
      <Tooltip
        arrow
        title={
          <ul>
            <li>{highCount} малых и уменьш.</li>
            <li>{neutralCount} чистых</li>
            <li>{lowCount} больших и увелич.</li>
          </ul>
        }
      >
        <p>
          Абс.{' '}
          <Chip
            label={String(highCount - lowCount).replace('-', '−')}
            style={{
              backgroundColor: absolutePositionBgColor,
              color: absolutePositionColor,
            }}
            size="small"
          />
        </p>
      </Tooltip>
    </>
  );
};

const Degree: React.FC<DegreeProps> = ({
  setAccidental,
  canLower,
  canRaise,
  ...restProps
}) => {
  const { accidental, info } = restProps;

  return (
    <Card variant="outlined" sx={{ minWidth: '100px' }}>
      <CardHeader title={degreeName(restProps)} sx={{ textAlign: 'center' }} />
      <CardContent sx={{ textAlign: 'center' }}>
        {info && <DegreeInformation {...restProps} />}
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
        <IconButton
          aria-label="lower"
          disabled={!canLower}
          onClick={() => {
            setAccidental(lowerDegree(accidental));
          }}
        >
          <ArrowDropDownIcon />
        </IconButton>
        <IconButton
          aria-label="raise"
          disabled={!canRaise}
          onClick={() => {
            setAccidental(raiseDegree(accidental));
          }}
        >
          <ArrowDropUpIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export function Scale() {
  const [degrees, setDegrees] = useState<Array<DegreeProps>>(
    [...new Array(7).keys()].map((idx) => ({
      no: idx + 1,
      accidental: 'natural',
      setAccidental: (acc) => {
        setAccidental(idx, acc);
      },
      canLower: true,
      canRaise: true,
    })),
  );

  function setAccidental(idx: number, acc: Accidental) {
    setDegrees((degrees) => [
      ...degrees.slice(0, idx),
      { ...degrees[idx], accidental: acc },
      ...degrees.slice(idx + 1),
    ]);
  }

  function canChangeDegree(idx: number, direction: Direction): boolean {
    if (idx === 0) {
      return false;
    }

    const { accidental } = degrees[idx];

    if (accidental === 'sharp' && direction === 'raise') {
      return false;
    }

    if (accidental === 'flat' && direction === 'lower') {
      return false;
    }

    if (accidental === 'natural' && direction === 'raise' && idx === 6) {
      return false;
    }

    return true;
  }

  const theme = useTheme();
  const analysis = analyzeScale(degrees.map((d) => d.accidental));

  const orderedColors = [
    [theme.palette.low.dark, theme.palette.low.contrastText],
    [theme.palette.low.main, theme.palette.low.contrastText],
    [theme.palette.low.light, theme.palette.low.contrastText],
    [undefined, undefined],
    [theme.palette.high.light, theme.palette.high.contrastText],
    [theme.palette.high.main, theme.palette.high.contrastText],
    [theme.palette.high.dark, theme.palette.high.contrastText],
  ];

  const indices = [0, 1, 2, 3, 4, 5, 6].sort(
    (a, b) =>
      (analysis.degrees?.[a].absolutePosition.highCount ?? 0) -
      (analysis.degrees?.[a].absolutePosition.lowCount ?? 0) -
      ((analysis.degrees?.[b].absolutePosition.highCount ?? 0) -
        (analysis.degrees?.[b].absolutePosition.lowCount ?? 0)),
  );

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Stack direction={'row'} spacing={2} sx={{ marginBottom: 2 }}>
        {degrees.map((degree, idx) => {
          const orderedColor =
            orderedColors[indices.findIndex((i) => idx === i)] ?? [];

          return (
            <Degree
              {...degree}
              key={degree.no}
              canLower={canChangeDegree(idx, 'lower')}
              canRaise={canChangeDegree(idx, 'raise')}
              info={analysis.degrees?.[idx]}
              absolutePositionBgColor={orderedColor[0]}
              absolutePositionColor={orderedColor[1]}
            />
          );
        })}
      </Stack>

      {analysis.errors && (
        <Stack spacing={2}>
          {analysis.errors.map((error, index) => (
            <Alert severity="warning" key={index}>
              {error}
            </Alert>
          ))}
        </Stack>
      )}
    </Box>
  );
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    low: true;
    high: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    low: Palette['primary'];
    high: Palette['primary'];
  }

  interface PaletteOptions {
    low?: PaletteOptions['primary'];
    high?: PaletteOptions['primary'];
  }
}
