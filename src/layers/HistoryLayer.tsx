import { keyframes, styled } from '@mui/material/styles';
import { pluckFirst, useObservable, useObservableState } from 'observable-hooks';
import { memo } from 'react';
import { distinctUntilChanged, map, pairwise, scan, withLatestFrom } from 'rxjs';

import { Ant } from '../ants';

// Types
export interface HistoryLayerProps {
  ant: Ant;
  limit?: number;
}

interface LayerProps {
  h: number;
  w: number;
}

// Animations
const movingDash = keyframes`
  0% {
    stroke-dashoffset: .4;
  }
  
  100% {
    stroke-dashoffset: 0;
  }
`;

// Styles
const Layer = styled('svg', { skipSx: true })<LayerProps>((props) => ({
  width: '100%',
  height: '100%',
  gridColumn: `1 / ${props.w + 2}`,
  gridRow: `1 / ${props.h + 2}`,
  pointerEvents: 'none',
  animation: `${movingDash} 750ms infinite ease`
}));

// Component
export const HistoryLayer = memo<HistoryLayerProps>(function HistoryLayer(props) {
  const { ant } = props;

  // Observables
  const limit$ = useObservable(pluckFirst, [props.limit ?? 0]);

  // State
  const [path] = useObservableState(() => ant.position$.pipe(
    distinctUntilChanged((a, b) => a.equals(b)),
    map((pos) => pos.sub(ant.map.bbox.tl).add(0.5, 0.5)),
    pairwise(),
    map(([prev, pos]) => `${prev.distance(pos) > 2 ? 'M' : 'L'} ${pos.x} ${pos.y}`),
    withLatestFrom(limit$),
    scan((old, [pos, limit]) => [...old.slice(-limit), pos], [] as string[]),
    map((history) => history.join(' ').replace(/^L/, 'M'))
  ), '');

  // Render
  return (
    <Layer
      w={ant.map.bbox.w} h={ant.map.bbox.h}
      viewBox={`0 0 ${ant.map.bbox.w + 1} ${ant.map.bbox.h + 1}`}
    >
      <path
        d={path}
        fill="transparent"
        stroke={ant.color.color}
        strokeDasharray=".1 .3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".1"
      />
    </Layer>
  );
});
