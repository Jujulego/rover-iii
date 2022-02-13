import { Box } from '@mui/material';
import { FC } from 'react';

import { useMap, useMapParameters } from './MapLayers';

// Component
export const LayerStack: FC = ({ children }) => {
  // Context
  const map = useMap();
  const { tileSize } = useMapParameters();

  // Render
  const w = map ? map.bbox.w + 1: 0;
  const h = map ? map.bbox.h + 1: 0;

  return (
    <Box component="main" flex={1}>
      <Box position="relative" width={w * tileSize} height={h * tileSize}>
        { children }
      </Box>
    </Box>
  );
};
