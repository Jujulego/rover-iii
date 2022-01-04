import { Box } from '@mui/material';
import { FC } from 'react';

import { Layer } from '../../maps/layer';

import { ImgTile } from './ImgTile';

// Types
export interface LayerProps {
  layer: Layer;
}

// Component
export const ImgLayer: FC<LayerProps> = ({ layer }) => (
  <Box display="grid" width="min-content">
    { layer.tiles.map(({ pos, biome }) => (
      <ImgTile key={`${pos.x}:${pos.y}`} pos={pos.sub(layer.bbox.tl)} biome={biome} />
    )) }
  </Box>
);
