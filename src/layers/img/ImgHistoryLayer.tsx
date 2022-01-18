import { Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { pluckFirst, useObservable, useObservableState } from 'observable-hooks';
import { memo } from 'react';
import { distinctUntilChanged, map, pairwise, scan, withLatestFrom } from 'rxjs';

import { Ant } from '../../ants';
import { Map } from '../../maps';

// Types
export interface ImgHistoryLayerProps {
  ant: Ant;
  map: Map;
  limit?: number;
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

// Component
export const ImgHistoryLayer = memo<ImgHistoryLayerProps>(function ImgHistoryLayer(props) {
  const { ant } = props;

  // Observables
  const map$ = useObservable(pluckFirst, [props.map]);
  const limit$ = useObservable(pluckFirst, [props.limit ?? 0]);

  // State
  const [path] = useObservableState(() => ant.position$.pipe(
    distinctUntilChanged((a, b) => a.equals(b)),
    withLatestFrom(map$),
    map(([pos, map]) => pos.sub(map.bbox.tl).add(0.5, 0.5)),
    pairwise(),
    map(([prev, pos]) => `${prev.distance(pos) > 2 ? 'M' : 'L'} ${pos.x} ${pos.y}`),
    withLatestFrom(limit$),
    scan((old, [pos, limit]) => [...old.slice(-limit), pos], [] as string[]),
    map((history) => history.join(' ').replace(/^L/, 'M'))
  ), '');

  // Render
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${props.map.bbox.w + 1} ${props.map.bbox.h + 1}`}

      width="100%"
      height="100%"
      gridColumn={`1 / ${props.map.bbox.w + 2}`}
      gridRow={`1 / ${props.map.bbox.h + 2}`}
      pointerEvents="none"

      sx={{
        animation: ({ transitions }) => `${movingDash} 750ms infinite ${transitions.easing.easeInOut}`
      }}
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
    </Box>
  );
});
