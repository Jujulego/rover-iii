import { Box } from '@mui/material';
import { FC } from 'react';

import { Thing } from '../../ants';
import { Map } from '../../maps';

// Types
export interface ImgThingLayerProps {
  map: Map;
  things: Thing[];
}

// Component
export const ImgThingLayer: FC<ImgThingLayerProps> = ({ map, things }) => (
  <>
    { things.map((thg, i) => (
      <Box
        key={i}
        component="img"
        height="100%"
        width="100%"
        gridRow={thg.position.y - map.bbox.t + 1}
        gridColumn={thg.position.x - map.bbox.l + 1}
        src={thg?.image?.toString() || ''}
      />
    )) }
  </>
);
