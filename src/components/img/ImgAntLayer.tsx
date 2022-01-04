import { Box } from '@mui/material';
import { FC } from 'react';

import { Ant } from '../../ants/ant';

// Types
export interface ImgAntLayerProps {
  ants: Ant[];
}

// Component
export const ImgAntLayer: FC<ImgAntLayerProps> = ({ ants }) => (
  <>
    { ants.map((ant, i) => (
      <Box
        key={i}
        component="img"
        gridRow={ant.position.y - ant.map.bbox.t + 1}
        gridColumn={ant.position.x - ant.map.bbox.l + 1}
        src={ant?.image?.toString() || ''}
      />
    )) }
  </>
);
