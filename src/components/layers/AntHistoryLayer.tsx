import { keyframes, styled } from '@mui/material/styles';
import { pluckFirst, useObservable, useObservableState } from 'observable-hooks';
import { memo } from 'react';
import { distinctUntilChanged, map, pairwise, scan, withLatestFrom } from 'rxjs';

import { Ant } from '../../ants';
import { useMapParameters } from '../MapLayers';

// Types
export interface AntHistoryLayerProps {
  ant: Ant;
  limit?: number;
}

interface LayerProps {
  h: number;
  w: number;
  s: number;
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
  position: 'absolute',
  top: 0,
  left: 0,
  width: props.w * props.s,
  height: props.h * props.s,
  zIndex: 20,
  pointerEvents: 'none',
  animation: `${movingDash} 750ms infinite ease`
}));

// Component
export const AntHistoryLayer = memo<AntHistoryLayerProps>(function AntHistoryLayer(props) {
  const { ant } = props;

  // Context
  const { tileSize } = useMapParameters();

  // Observables
  const limit$ = useObservable(pluckFirst, [props.limit ?? 0]);

  // State
  const [path] = useObservableState(() => {
    const ini = ant.position.sub(ant.map.bbox.tl).add(0.5, 0.5);

    return ant.position$.pipe(
      distinctUntilChanged((a, b) => a.equals(b)),
      map((pos) => pos.sub(ant.map.bbox.tl).add(0.5, 0.5)),
      pairwise(),
      map(([prev, pos]) => `${prev.distance(pos) > 2 ? 'M' : 'L'} ${pos.x} ${pos.y}`),
      withLatestFrom(limit$),
      scan((old, [pos, limit]) => [...old.slice(-limit), pos], [`M ${ini.x} ${ini.y}`]),
      map((history) => history.join(' ').replace(/^L/, 'M'))
    );
  }, '');

  // Render
  return (
    <Layer
      w={ant.map.bbox.w + 1} h={ant.map.bbox.h + 1} s={tileSize}
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
