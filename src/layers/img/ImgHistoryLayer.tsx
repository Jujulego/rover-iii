import { useDeepMemo } from '@jujulego/alma-utils';
import { Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { FC, useEffect, useMemo, useState } from 'react';

import { Ant } from '../../ants';
import { Map } from '../../maps';
import { Vector } from '../../math2d';

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
export const ImgHistoryLayer: FC<ImgHistoryLayerProps> = (props) => {
  const { ant, map, limit = 0 } = props;

  // State
  const [history, setHistory] = useState<Vector[]>([]);

  // Effects
  const position = useDeepMemo(ant.position);

  useEffect(() => {
    setHistory((old) => [...old.slice(-limit), position]);
  }, [limit, position]);

  // Memos
  const path = useMemo(() => {
    const parts: string[] = [];
    let prev = position;

    for (const pos of history) {
      const cmd = parts.length > 0 && prev.distance(pos) < 2 ? 'L' : 'M';

      parts.push(`${cmd} ${pos.x - map.bbox.l + 0.5} ${pos.y - map.bbox.t + 0.5}`);
      prev = pos;
    }

    return parts.join(' ');
  }, [history, map]);

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
};
