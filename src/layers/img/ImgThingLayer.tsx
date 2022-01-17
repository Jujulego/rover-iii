import { Box } from '@mui/material';
import { memo } from 'react';

import { Thing } from '../../ants';
import { Map } from '../../maps';

// Types
export interface ImgThingLayerProps {
  map: Map;
  things: Thing[];
}

// Component
export const ImgThingLayer = memo<ImgThingLayerProps>(function ImgThingLayer({ map, things }) {
  return <>
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
  </>;
}, (prev, next) =>
  prev.map.name === next.map.name &&
  prev.things.every((pt, i) =>
    next.things[i]?.position?.equals(pt.position) &&
    next.things[i]?.image === pt.image
  )
);
