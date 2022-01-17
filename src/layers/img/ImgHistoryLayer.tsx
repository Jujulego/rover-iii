import { Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { memo, useEffect, useMemo, useState } from 'react';

import { Ant } from '../../ants';
import { Map } from '../../maps';
import { NULL_VECTOR, Vector } from '../../math2d';
import { distinctUntilChanged } from 'rxjs';

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
  const { ant, map, limit = 0 } = props;

  // State
  const [history, setHistory] = useState<Vector[]>([]);

  // Effects
  useEffect(() => {
    const sub = ant.position$
      .pipe(
        distinctUntilChanged((a, b) => a.equals(b))
      )
      .subscribe((pos) => {
        setHistory((old) => [...old.slice(-limit), pos]);
      });

    return () => sub.unsubscribe();
  }, [ant, limit]);

  // Memos
  const path = useMemo(() => {
    const parts: string[] = [];
    let prev = NULL_VECTOR;

    for (const pos of history) {
      const cmd = parts.length > 0 && prev.distance(pos) < 2 ? 'L' : 'M';

      parts.push(`${cmd} ${pos.x - map.bbox.l + 0.5} ${pos.y - map.bbox.t + 0.5}`);
      prev = pos;
    }

    return parts.join(' ');
  }, [map, history]);

  // Render
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${map.bbox.w + 1} ${map.bbox.h + 1}`}

      width="100%"
      height="100%"
      gridColumn={`1 / ${map.bbox.w + 2}`}
      gridRow={`1 / ${map.bbox.h + 2}`}
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
