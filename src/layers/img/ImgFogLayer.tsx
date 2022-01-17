import { Box } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { FC } from 'react';

import { DStarAnt } from '../../ants';
import { Map } from '../../maps';

// Types
export interface ImgFogLayerProps {
  ant: DStarAnt;
  map: Map;
}

// Component
export const ImgFogLayer: FC<ImgFogLayerProps> = (props) => {
  const { ant, map } = props;

  // State
  const tiles = useLiveQuery(() => map.tiles(), [map], []);

  // Render
  return (
    <>
      { tiles.filter(({ pos }) => !ant.getMapData(pos)?.detected).map(({ pos }) => (
        <Box
          key={`${pos.x}:${pos.y}`}

          sx={{
            gridRow: pos.y - map.bbox.t + 1,
            gridColumn: pos.x - map.bbox.l + 1,

            bgcolor: 'white',
            opacity: 0.5,
            pointerEvents: 'none'
          }}
        />
      )) }
    </>
  );
};
