import { useDeepMemo } from '@jujulego/alma-utils';
import { Box } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';

import { Ant } from '../../ants';
import { Map } from '../../maps';
import { Vector } from '../../math2d';

// Types
export interface ImgHistoryLayerProps {
  ant: Ant;
  map: Map;
}

// Component
export const ImgHistoryLayer: FC<ImgHistoryLayerProps> = (props) => {
  const { ant, map } = props;

  // State
  const [history, setHistory] = useState<Vector[]>([]);

  // Effects
  const position = useDeepMemo(ant.position);

  useEffect(() => {
    setHistory((old) => [...old, position]);
  }, [position]);

  // Memos
  const path = useMemo(() => {
    return history.reduceRight((path, pos) => `${path} L ${pos.x - map.bbox.l + 0.5} ${pos.y - map.bbox.t + 0.5}`, `M ${position.x - map.bbox.l + 0.5} ${position.y - map.bbox.t + 0.5}`);
  }, [history, map, position]);

  // Render
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${map.bbox.w + 1} ${map.bbox.h + 1}`}

      width="100%"
      height="100%"
      gridColumn={`1 / ${map.bbox.w + 2}`}
      gridRow={`1 / ${map.bbox.h + 2}`}
    >
      <path
        d={path}
        fill="transparent"
        stroke={ant.color.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".1"
        opacity=".5"
      />
    </Box>
  );
};
